import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, Marker, MapContainer, TileLayer, Circle, } from 'react-leaflet';
import Select, { SingleValue } from 'react-select';
import { AxiosResponse } from 'axios';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Grid,
  GridItem,
  HStack,
  Image,
  Text as Info,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  VStack,
  useRadioGroup
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import L from 'leaflet';
import { GeoJSONObject } from 'ol/format/GeoJSON';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';

import { Advertisement, CustomInput, GeocoderLeaflet, RadioCard } from '@/components';
import { CITY_ENUM, REAL_ESTATE_ENUM, REAL_ESTATE_VALUE_ENUM } from '@/enums';
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
import gasStation from '@/resources/gasStations.json';
import health from '@/resources/health.json';
import restaurants from '@/resources/restaurants.json';
import banks from '@/resources/banks.json';
import exchangeOffice from '@/resources/exchangeOffice.json';
import vrtici from '@/resources/vrtici.json';
import skole from '@/resources/skole.json';
import supermarkets from '@/resources/marketi.json';
import {
  useFastSearchMutation,
  useGetSearchedAdvertisementsMutation,
  useLocationSearchMutation
} from '@/services';
import { RealEstateTypesProps, SelectOption } from '@/types';

export const HomePage = () => {
  const [t] = useTranslation('common');
  const [isSearched, setIsSearched] = useState(false);
  const [position, setPosition] = useState({lat: 45.2428032, lng: 19.849218322071287});
  const markerRef = useRef<any>(null);
  const myAPIKey = 'b6618ad7359b4f779daeae7e35233c67';
  const [isChosen, setIsChosen] = useState(false);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  let address = {};
  const [isBank, setIsBank] = useState(false);
  const [isGasStation, setIsGasStation] = useState(false);
  const [isHealth, setIsHealth] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [isExchangeOffice, setIsExchangeOffice] = useState(false);
  const [isVrtici, setIsVrtici] = useState(false);
  const [isSupermarket, setIsSupermarket] = useState(false);
  const [isLocationSearch, setIsLocationSearch] = useState(false);
  const [isNormalSearch, setIsNormalSearch] = useState(false);
  const [searchResponse, setSearchResponse] = useState<AxiosResponse | undefined>(undefined);
  const [fastSearchResponse, setFastSearchResponse] = useState<AxiosResponse | undefined>(undefined);
  const [locationSearchResponse, setLocationSearchResponse] = useState<AxiosResponse | undefined>(undefined);
  const initialLatitude = 45.2428032;
  const initialLongitude = 19.849218322071287;
  const [radiusSet, setRadiusSet] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  L.Marker.prototype.options.icon = DefaultIcon;

  const { mutate: fastSearch } = useFastSearchMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      setFastSearchResponse(response);
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const { mutate: locationSearch } = useLocationSearchMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      setLocationSearchResponse(response);
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const { mutate: searchMutation } = useGetSearchedAdvertisementsMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      setSearchResponse(response);
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const realEstateObjects = Object.keys(REAL_ESTATE_ENUM)
    .filter((v) => isNaN(Number(v)))
    .map((label) => {
      return {
        value: REAL_ESTATE_ENUM[label as keyof typeof REAL_ESTATE_ENUM],
        label: t(`${label}`) || label
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
        label: t(`${label}`) || label
      };
    });

  const getInitialValues = (): RealEstateTypesProps => {
    return {
      realEstateType: realEstateObjects[0]?.value,
      advertisementType: REAL_ESTATE_VALUE_ENUM.SALE,
      city: '',
      minPrice: 0,
      maxPrice: 0,
      minQuadrature: 0,
      maxQuadrature: 0
    };
  };

  const searchSchema = Yup.object().shape({
    city: Yup.string()
  });

  let payload: RealEstateTypesProps = {};

  const handleSubmit = (values: RealEstateTypesProps) => {
    payload = {
      realEstateType: values?.realEstateType,
      advertisementType: values?.advertisementType,
      city: values?.city,
      minPrice: values?.minPrice,
      maxPrice: values?.maxPrice,
      minQuadrature: values?.minQuadrature,
      maxQuadrature: values?.maxQuadrature
    };
    searchMutation(payload);
    setIsNormalSearch(true);
    setIsSearched(false);
    setIsLocationSearch(false);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${myAPIKey}`;
    fetch(reverseGeocodingUrl).then(result => result.json())
      .then(featureCollection => {
        address = featureCollection.features[0].properties;
      });
    setIsChosen(true);
  }, [position]);

  let payloadSearchByLocation = {};
  const radius = radiusSet;
  const positionObject = {latitude: position.lat, longitude: position.lng};

  useEffect(() => {
    payloadSearchByLocation = {
      radius,
      positionObject
    };
  }, [positionObject]);

  const handleSearchByLocation = (e: any) => {
    e = payloadSearchByLocation;
    setIsLocationSearch(true);
    setIsNormalSearch(false);
    setIsSearched(false);
    locationSearch(e);
  };

  const handleClick = (x: number, y: number) => {
    const payloadFastSearch = {
      cityType: cityObjects[x - 1].value,
      realEstateType: realEstateObjects[y - 1].value
    };
    fastSearch(payloadFastSearch);
    setIsSearched(true);
    setIsLocationSearch(false);
    setIsNormalSearch(false);
  };

  return (
    <>
      <VStack
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2%',
          marginBottom: '2%'
        }}>
        <Grid
          display='flex'
          alignItems='flex-start'
          justifyContent='flex-start'
          width='80%'
          height='80vh'
          boxShadow='2xl'
          bg='blue.300'
          borderRadius='10'
          padding='2%'
          textColor='white'>
          <GridItem boxSize='lg' width='60%'>
            <Image
              src='https://buildingdesign.com.np/service/1649243702_building-design.jpg'
              alt='New building'
              borderRadius='2xl'
            />
          </GridItem>
          <GridItem ml='10%'>
            <Info fontWeight='500' fontSize='25'>{t('search')}</Info>
            <VStack>
              <Formik
                validateOnMount
                validateOnChange
                initialValues={getInitialValues()}
                validationSchema={searchSchema}
                onSubmit={handleSubmit}>
                {({isSubmitting, isValid, errors, touched, setFieldValue }) => (
                  <Form>
                    <Info fontWeight='500'>{t('chooseRealEstateType')}</Info>
                    <Select
                      name='realEstateType'
                      options={realEstateObjects}
                      onChange={(value) => {
                        setFieldValue('realEstateType', (value as SingleValue<SelectOption>)?.value);
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: '40px'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#3182CE' : '#63B3ED',
                          color: '#FFFFFF',
                          ':hover': {
                            backgroundColor: '#3182CE',
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
                          primary25: '#3182CE',
                          primary: '#3182CE',
                          neutral0: '#63B3ED',
                          neutral80: '#FFFFFF',
                        }
                      })}
                    />
                    <Info mt={3} fontWeight='500'>{t('chooseAdvertisementType')}</Info>
                    <Select
                      name='advertisementType'
                      options={realEstateValueObjects}
                      onChange={(value) => {
                        setFieldValue('advertisementType', (value as SingleValue<SelectOption>)?.value);
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: '40px'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#3182CE' : '#63B3ED',
                          color: '#FFFFFF',
                          ':hover': {
                            backgroundColor: '#3182CE',
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
                          primary25: '#3182CE',
                          primary: '#3182CE',
                          neutral0: '#63B3ED',
                          neutral80: '#FFFFFF',
                        }
                      })}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='city'
                      label={t('city')}
                      error={errors.city}
                      isInvalid={!!errors.city && touched.city}
                    />
                    <Grid display='flex' alignItems='inline' justifyContent='space-between'>
                      <CustomInput
                        type='number'
                        maxLength={50}
                        name='minPrice'
                        label={t('Minimum price')}
                        error={errors.minPrice}
                        isInvalid={!!errors.minPrice && touched.minPrice}
                      />
                      <CustomInput
                        type='number'
                        maxLength={50}
                        name='maxPrice'
                        label={t('Maximum price')}
                        error={errors.maxPrice}
                        isInvalid={!!errors.maxPrice && touched.maxPrice}
                      />
                    </Grid>
                    <Grid display='flex' alignItems='inline' justifyContent='space-between'>
                      <CustomInput
                        type='number'
                        maxLength={50}
                        name='minQuadrature'
                        label={t('Minimum quadrature')}
                        error={errors.minQuadrature}
                        isInvalid={!!errors.minQuadrature && touched.minQuadrature}
                      />
                      <CustomInput
                        type='number'
                        maxLength={50}
                        name='maxQuadrature'
                        label={t('Maximum quadrature')}
                        error={errors.maxQuadrature}
                        isInvalid={!!errors.maxQuadrature && touched.maxQuadrature}
                      />
                    </Grid>
                    <Button
                      type='submit'
                      minW='100px'
                      size='lg'
                      top='2px'
                      bg='blue.600'
                      _hover={{bg: 'blue.400'}}
                      ml='35%'
                      cursor='pointer'
                      disabled={isSubmitting || !isValid}>
                      {t('search')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </VStack>
          </GridItem>
        </Grid>
        <VStack style={{ marginTop: '3%' }}>
          <Info textColor='blue.800' fontWeight='500' fontSize='25'>{t('fastSearch')}</Info>
          <TableContainer overflowY='auto' overflowX='hidden' h='35vh' borderRadius='lg'>
            <Table fontSize='16' variant='striped' colorScheme='blue' borderRadius='lg'>
              <Thead bg='blue.300' whiteSpace='break-spaces' textColor='white'>
                <Tr textColor='blue.800' fontWeight='500'>
                  {realEstateObjects?.map((x) => (
                    <Td key={x.value} textColor='blue.800' textAlign='center'>
                      {x.label}
                    </Td>
                  ))}
                </Tr>
              </Thead>
              <Tbody textColor='white' bg='blue.300' fontWeight='500'>
                {cityObjects?.map((x) => (
                  <Tr key={x.value}>
                    {realEstateObjects?.map((y) => (
                      <Td
                        key={y.value}
                        textAlign='center'
                        _hover={{ cursor: 'pointer' }}
                        onClick={() => handleClick(x.value, y.value)}>
                        {x.label}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
        <Info textColor='blue.800' fontWeight='500' fontSize='25'>{t('searchByLocation')}</Info>
        <Grid mb={3} backgroundColor={'blue.200'} width='60%' borderRadius='lg'>
          <Box mt={3} mb={3} ml={3} textColor='white' display='flex' alignItems='center' justifyContent='center'>
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
          <Box ml={10}>
            <CheckboxGroup>
              <Checkbox onChange={() => setRadiusSet(300)} textColor='white'>300m</Checkbox>
              <Checkbox ml={2} onChange={() => setRadiusSet(500)} textColor='white'>500m</Checkbox>
              <Checkbox ml={2} onChange={() => setRadiusSet(1000)} textColor='white'>1km</Checkbox>
              <Checkbox ml={2} textColor='white' isChecked={isChecked} onChange={() => isChecked ? setIsChecked(false) : setIsChecked(true)}>{t('Show radius')}</Checkbox>
            </CheckboxGroup>
          </Box>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <MapContainer
              id='chooseLocation'
              center={[initialLatitude, initialLongitude]}
              zoom={17}
              scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy;
                <a href="https://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker
                draggable={true}
                position={position}
                eventHandlers={eventHandlers}
                ref={markerRef}>
              </Marker>
              <GeocoderLeaflet />
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
              {isChecked && radiusSet > 0 && (
                <Circle center={[position.lat, position.lng]} radius={radiusSet} />
              )}
            </MapContainer>
          </Box>
          <Button
            isDisabled={!isChosen}
            w='200px'
            size='lg'
            top='2px'
            mt={2}
            ml={20}
            mb={2}
            bg='blue.600'
            _hover={{bg: 'blue.400'}}
            cursor='pointer'
            color='white'
            onClick={(e) => handleSearchByLocation(e.target)}>
            {t('searchByLocation')}
          </Button>
        </Grid>
      </VStack>
      {isSearched && (
        <Advertisement advertisement={fastSearchResponse} ml={'10'} isHomePage={true} />
      )}
      {isLocationSearch && (
        <Advertisement advertisement={locationSearchResponse} ml={'10'} isHomePage={true} />
      )}
      {isNormalSearch && (
        <Advertisement advertisement={searchResponse} ml={'10'} isHomePage={true} />
      )}
    </>
  );
};
