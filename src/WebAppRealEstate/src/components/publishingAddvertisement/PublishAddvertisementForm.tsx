import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, MapContainer, Marker, TileLayer, GeoJSON } from 'react-leaflet';
import Select from 'react-select';
import { AxiosResponse } from 'axios';
import { Box, Button, Checkbox, CheckboxGroup, HStack, Text as Info, useRadioGroup, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import L from 'leaflet';
import { GeoJSONObject } from 'ol/format/GeoJSON';
import * as Yup from 'yup';

import { PublishAdveretismentProps } from '@/types';
import { CustomInput } from '../common/CustomInput';
import { RadioCard } from '../common/RadioCard';
import {
  BankIcon,
  DefaultIcon,
  ExchangeOfficeIcon,
  GasStationIcon,
  KindergartenIcon,
  PharmacyHealthIcon,
  RestaurantIcon,
  SchoolIcon,
  SupermarketIcon,
  useErrorToast,
  useSuccessToast
} from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { usePublishAdvertisementMutation } from '@/services';
import { GeocoderLeaflet } from '../GeocoderLeaflet';
import gasStation from '@/resources/gasStations.json';
import health from '@/resources/health.json';
import restaurants from '@/resources/restaurants.json';
import banks from '@/resources/banks.json';
import exchangeOffice from '@/resources/exchangeOffice.json';
import vrtici from '@/resources/vrtici.json';
import skole from '@/resources/skole.json';
import supermarkets from '@/resources/marketi.json';
import { UserContext } from '@/contexts';
import { CITY_ENUM, REAL_ESTATE_ENUM, REAL_ESTATE_VALUE_ENUM } from '@/enums';

export const PublishAdvertisementForm = () => {
  const [t] = useTranslation('common');
  const [position, setPosition] = useState({lat: 45.2428032, lng: 19.849218322071287});
  const [latitude, setLatitude] = useState(45.242820);
  const [longitude, setLongitude] = useState(19.849140);
  const [isChecked, setIsChecked] = useState(false);
  const [radiusSet, setRadiusSet] = useState(0);
  const [isBank, setIsBank] = useState(false);
  const [isGasStation, setIsGasStation] = useState(false);
  const [isHealth, setIsHealth] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [isExchangeOffice, setIsExchangeOffice] = useState(false);
  const [isVrtici, setIsVrtici] = useState(false);
  const [isSupermarket, setIsSupermarket] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const markerRef = useRef<any>(null);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const { currentUser } = useContext(UserContext);
  const myAPIKey = 'b6618ad7359b4f779daeae7e35233c67';
  const Address = {
    house_number: '',
    road: '',
    city: '',
    postcode: '',
    state: '',
    lat: 0,
    lng: 0
  };
  const [address, setAddress] = useState(Address || null);
  let addressDrag = {};

  const realEstateObjects = Object.keys(REAL_ESTATE_ENUM)
    .filter((v) => isNaN(Number(v)))
    .map((label) => {
      return {
        value: REAL_ESTATE_ENUM[label as keyof typeof REAL_ESTATE_ENUM],
        label: t(label) || label
      };
    });

  const realEstateValueObjects = Object.keys(REAL_ESTATE_VALUE_ENUM)
    .filter((v) => isNaN(Number(v)))
    .map((label) => {
      return {
        value: REAL_ESTATE_VALUE_ENUM[label as keyof typeof REAL_ESTATE_VALUE_ENUM],
        label: t(`${label}`) || label
      };
    });

  const cityObjects = Object.keys(CITY_ENUM)
    .filter((v) => isNaN(Number(v)))
    .map((label) => {
      return {
        value: CITY_ENUM[label as keyof typeof CITY_ENUM],
        label: t(label) || label
      };
    });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'advertisementType',
    defaultValue: '',
    onChange: console.log,
  });

  const group = getRootProps();

  const initialValues = {
    title: '',
    type: REAL_ESTATE_ENUM.APARTMENT,
    city: CITY_ENUM['Novi Sad'],
    advertisementType: REAL_ESTATE_VALUE_ENUM.RENT,
    quadrature: 0,
    price: 0,
    realiseDate: new Date(),
    description: ''
  };

  const { mutate: publishAdvertisementMutation } = usePublishAdvertisementMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const publishAdvertisementSchema = Yup.object().shape({
    title: Yup.string(),
    quadrature: Yup.number(),
    price: Yup.number(),
    description: Yup.string()
  });

  const addString = localStorage['address'];
  useEffect(() => {
    if (addString !== null) {
      setAddress(JSON.parse(addString));
      setLatitude(address.lat);
      setLongitude(address.lng);
    }
  }, []);

  const [selectedType, setSelectedType] = useState<REAL_ESTATE_ENUM | null>(initialValues.type);
  const [chosenType, setChosenType] = useState<REAL_ESTATE_VALUE_ENUM | null>(initialValues.advertisementType);
  const [selectedCity, setSelectedCity] = useState<CITY_ENUM | null>(initialValues.city);
  const [city, setCity] = useState<CITY_ENUM | null>(initialValues.city);

  const handleSubmit = (values: PublishAdveretismentProps) => {
    const payload = {
      title: values?.title,
      type: selectedType === null ? undefined : selectedType,
      advertisementType: chosenType,
      quadrature: values?.quadrature,
      price: values?.price,
      realiseDate: new Date,
      description: values?.description,
      address: isDrag ? addressDrag : address,
      userId: currentUser?.id
    };
    publishAdvertisementMutation(payload);
  };

  L.Marker.prototype.options.icon = DefaultIcon;

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          setPosition(marker.getLatLng());
        }
        setIsDrag(true);
      },
    }),
    [],
  );

  useEffect(() => {
    const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${myAPIKey}`;
    fetch(reverseGeocodingUrl).then(result => result.json())
      .then(featureCollection => {
        const obj = featureCollection.features[0].properties;
        const houseNumber = Number(obj.housenumber);
        const road = obj.street;
        setCity(obj.city);
        const postCode = Number(obj.postcode);
        const state = obj.country;
        const lat = obj.lat;
        const lng = obj.lon;
        addressDrag = {road, houseNumber, city, postCode, state, lat, lng};
      });
  }, [position]);

  return (
    <VStack
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
      <Box bg='blue.200' borderRadius='10' textColor='white'>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={publishAdvertisementSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting, isValid, errors, touched }) => (
            <Form>
              <CustomInput
                type='text'
                maxLength={50}
                isInvalid={!!errors.title && touched.title}
                name='title'
                label={t('title')}
                error={errors.title}
              />
              <Info fontWeight='500'>{t('chooseRealEstateType')}</Info>
              <Select
                name='type'
                value={selectedType === null ? null : realEstateObjects.find((obj) => obj.value === selectedType)}
                onChange={(newValue) => setSelectedType(newValue === null ? null : newValue.value)}
                options={realEstateObjects}
                styles={{
                  control: (base) => ({
                    ...base,
                    height: '40px'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#90cdf4' : '#63B3ED',
                    color: '#FFFFFF',
                    ':hover': {
                      backgroundColor: '#90cdf4',
                      color: '#FFFFFF'
                    },
                  }),
                  placeholder: (defaultStyles) => {
                    return {
                      ...defaultStyles,
                      color: '#FFFFFF',
                    };
                  }
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: '#90cdf4',
                    primary: '#90cdf4',
                    neutral0: '#90cdf4',
                    neutral80: '#FFFFFF',
                  }
                })}
              />
              <Info fontWeight='500' mt={2}>{t('chooseCity')}</Info>
              <Select
                name='type'
                value={selectedCity === null ? null : cityObjects.find((obj) => obj.value === selectedCity)}
                onChange={(newValue) => setSelectedCity(newValue === null ? null : newValue.value)}
                options={cityObjects}
                styles={{
                  control: (base) => ({
                    ...base,
                    height: '40px'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#90cdf4' : '#63B3ED',
                    color: '#FFFFFF',
                    ':hover': {
                      backgroundColor: '#90cdf4',
                      color: '#FFFFFF'
                    },
                  }),
                  placeholder: (defaultStyles) => {
                    return {
                      ...defaultStyles,
                      color: '#FFFFFF',
                    };
                  }
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: '#90cdf4',
                    primary: '#90cdf4',
                    neutral0: '#90cdf4',
                    neutral80: '#FFFFFF',
                  }
                })}
              />
              <Info mt={3} fontWeight='500'>{t('chooseAdvertisementType')}</Info>
              <HStack {...group}>
                {realEstateValueObjects.map((value) => {
                  const radio = getRadioProps({ value });
                  return (
                    <RadioCard name='advertisementType' key={value.value}
                      checked={value.value === chosenType}
                      onChange={() => setChosenType(value.value)}>
                      {value.label}
                    </RadioCard>
                  );
                })}
              </HStack>
              <CustomInput
                type='number'
                maxLength={50}
                isInvalid={!!errors.quadrature && touched.quadrature}
                placeholder={'m2'}
                name='quadrature'
                label={t('quadrature')}
                error={errors.quadrature}
              />
              <CustomInput
                type='number'
                maxLength={50}
                isInvalid={!!errors.price && touched.price}
                name='price'
                placeholder={'EUR'}
                label={t('price')}
                error={errors.price}
              />
              <CustomInput
                type='text'
                isInvalid={!!errors.description && touched.description}
                name='description'
                label={t('description')}
                error={errors.description}
              />
              <Info fontWeight={'500'} fontSize={'20'} textColor={'white'}>{t('location')}</Info>
              <Box>
                <CheckboxGroup>
                  <Checkbox ml={2} isChecked={isSchool} onChange={() => isSchool ? setIsSchool(false) : setIsSchool(true)}>{t('primarySchool')}</Checkbox>
                  <Checkbox ml={2} isChecked={isRestaurant} onChange={() => isRestaurant ? setIsRestaurant(false) : setIsRestaurant(true)}>{t('restaurants')}</Checkbox>
                  <Checkbox ml={2} isChecked={isSupermarket} onChange={() => isSupermarket ? setIsSupermarket(false) : setIsSupermarket(true)}>{t('supermarkets')}</Checkbox>
                  <Checkbox ml={2} isChecked={isVrtici} onChange={() => isVrtici ? setIsVrtici(false) : setIsVrtici(true)}>{t('kindergarten')}</Checkbox>
                  <Checkbox ml={2} isChecked={isGasStation} onChange={() => isGasStation ? setIsGasStation(false) : setIsGasStation(true)}>{t('gasStations')}</Checkbox>
                  <Checkbox ml={2} isChecked={isBank} onChange={() => isBank ? setIsBank(false) : setIsBank(true)}>{t('banks')}</Checkbox>
                  <Checkbox ml={2} isChecked={isExchangeOffice} onChange={() => isExchangeOffice ? setIsExchangeOffice(false) : setIsExchangeOffice(true)}>{t('exchangeOffice')}</Checkbox>
                  <Checkbox ml={2} isChecked={isHealth} onChange={() => isHealth ? setIsHealth(false) : setIsHealth(true)}>{t('pharmacyAndHealth')}</Checkbox>
                </CheckboxGroup>
              </Box>
              <Box>
                <CheckboxGroup>
                  <Checkbox onChange={() => setRadiusSet(300)} textColor='white'>300m</Checkbox>
                  <Checkbox ml={2} onChange={() => setRadiusSet(500)} textColor='white'>500m</Checkbox>
                  <Checkbox ml={2} onChange={() => setRadiusSet(1000)} textColor='white'>1km</Checkbox>
                  <Checkbox ml={2} textColor='white' isChecked={isChecked} onChange={() => isChecked ? setIsChecked(false) : setIsChecked(true)}>{t('Show radius')}</Checkbox>
                </CheckboxGroup>
              </Box>
              <MapContainer id='chooseLocation' center={[latitude, longitude]} zoom={17} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <GeocoderLeaflet />
                <Marker
                  draggable={true}
                  position={position}
                  eventHandlers={eventHandlers}
                  ref={markerRef}>
                </Marker>
                {isHealth &&
                <GeoJSON
                  data={health.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: PharmacyHealthIcon });
                  }}
                />
                }
                {isSchool &&
                <GeoJSON
                  data={skole.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: SchoolIcon });
                  }}
                />
                }
                {isRestaurant &&
                <GeoJSON
                  data={restaurants.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: RestaurantIcon });
                  }}
                />
                }
                {isGasStation &&
                <GeoJSON
                  data={gasStation.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: GasStationIcon });
                  }}
                />
                }
                {isBank &&
                <GeoJSON
                  data={banks.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: BankIcon });
                  }}
                />
                }
                {isExchangeOffice &&
                <GeoJSON
                  data={exchangeOffice.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: ExchangeOfficeIcon });
                  }}
                />
                }
                {isVrtici &&
                <GeoJSON
                  data={vrtici.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: KindergartenIcon });
                  }}
                />
                }
                {isSupermarket &&
                <GeoJSON
                  data={supermarkets.features as unknown as GeoJSONObject}
                  pointToLayer={(feature, latlng) => {
                    return L.marker(latlng, { icon: SupermarketIcon });
                  }}
                />
                }
                {isChecked && (
                  <Circle center={[position.lat, position.lng]} radius={350} />
                )}
              </MapContainer>
              <Button
                type='submit'
                minW='100px'
                size='lg'
                top='15px'
                bg='blue.600'
                _hover={{bg: 'blue.400'}}
                ml={3}
                mb={3}
                cursor='pointer'
                disabled={isSubmitting || !isValid}>
                {t('save')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
};
