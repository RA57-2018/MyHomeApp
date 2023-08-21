import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import Select from 'react-select';
import {
  Button,
  HStack,
  Text as Info,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useRadioGroup
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { GeocoderLeaflet } from '../GeocoderLeaflet';
import { CustomInput } from '../common/CustomInput';
import { RadioCard } from '../common/RadioCard';
import { REAL_ESTATE_ENUM, REAL_ESTATE_VALUE_ENUM } from '@/enums';
import { EditAdvertisementType } from '@/types';
import { DefaultIcon, initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useEditMutation, useGetAdvertisementQuery } from '@/services';
import { AxiosResponse } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface EditModalProps {
    modalOpen: boolean;
    onClose: () => void;
    idAdvertisement: number;
}

export const EditAdvertisement = (props: EditModalProps) => {
  const [t] = useTranslation('common');
  const [position, setPosition] = useState({lat: 45.2428032, lng: 19.849218322071287});
  const myAPIKey = 'b6618ad7359b4f779daeae7e35233c67';
  const markerRef = useRef<any>(null);
  let address = {};
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const {data: advertisementData = initialAxiosResponse} = useGetAdvertisementQuery(props.idAdvertisement);

  const { mutate: editAdv } = useEditMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

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
    const reverseGeocodingUrl =
    `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${myAPIKey}`;
    fetch(reverseGeocodingUrl).then(result => result.json())
      .then(featureCollection => {
        address = featureCollection.features[0].properties;
      });
  }, [position]);

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

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'advertisementType',
    defaultValue: '',
    onChange: console.log,
  });

  const group = getRootProps();

  const editAdvertisementSchema = Yup.object().shape({
    title: Yup.string(),
    quadrature: Yup.number(),
    price: Yup.number(),
    description: Yup.string()
  });

  const initialValues = {
    title: advertisementData?.data?.title ?? '',
    type: REAL_ESTATE_ENUM.APARTMENT,
    advertisementType: REAL_ESTATE_VALUE_ENUM.RENT,
    quadrature: advertisementData?.data?.quadrature ?? 0,
    price: advertisementData?.data?.price ?? 0,
    realiseDate: new Date(),
    description: advertisementData?.data?.description ?? ''
  };

  const [selectedType, setSelectedType] = useState<REAL_ESTATE_ENUM | null>(initialValues.type);
  const [chosenType, setChosenType] = useState<REAL_ESTATE_VALUE_ENUM | null>(initialValues.advertisementType);

  const handleSubmit = (values: EditAdvertisementType) => {
    const payload = {
      title: values.title,
      type: selectedType === null ? undefined : selectedType,
      advertisementType: chosenType,
      quadrature: values.quadrature,
      price: values.price,
      realiseDate: values.realiseDate,
      description: values.description,
      address: address
    };
    const idd = advertisementData?.data?.id;
    editAdv({idAdvertisement: idd, payload: payload});
    props.onClose();
  };

  return (
    <>
      <Modal isCentered isOpen={props.modalOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200' minW='1050px' mt={3}>
          <Formik
            validateOnMount
            validateOnChange
            initialValues={initialValues}
            validationSchema={editAdvertisementSchema}
            onSubmit={handleSubmit}>
            {({ isValid, errors, touched }) => (
              <Form>
                <ModalHeader textColor='blue.800' fontWeight={'500'}>{t('edit')}</ModalHeader>
                <ModalCloseButton bg='blue.500' _hover={{bg: 'blue.600'}} />
                <ModalBody fontSize={'18'} h='80vh' overflowY='auto' overflowX='hidden'>
                  <CustomInput
                    type='text'
                    maxLength={50}
                    isInvalid={!!errors.title && touched.title}
                    name='title'
                    label={t('title')}
                    error={errors.title}
                  />
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
                    type='text'
                    maxLength={50}
                    isInvalid={!!errors.quadrature && touched.quadrature}
                    name='quadrature'
                    label={t('quadrature')}
                    error={errors.quadrature}
                  />
                  <CustomInput
                    type='text'
                    maxLength={50}
                    isInvalid={!!errors.price && touched.price}
                    name='price'
                    label={t('price')}
                    error={errors.price}
                  />
                  <CustomInput
                    type='text'
                    maxLength={50}
                    isInvalid={!!errors.description && touched.description}
                    name='description'
                    label={t('description')}
                    error={errors.description}
                  />
                  <Info fontWeight={'500'} fontSize={'20'} textColor={'white'}>{t('location')}</Info>
                  <MapContainer id='chooseLocation' center={[45.242820, 19.849140]} zoom={17} scrollWheelZoom={true}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <GeocoderLeaflet />
                    <Marker
                      draggable={true}
                      position={position}
                      eventHandlers={eventHandlers}
                      icon={DefaultIcon}
                      ref={markerRef}>
                    </Marker>
                  </MapContainer>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={props.onClose}>{t('close')}</Button>
                  <Button colorScheme='blue' type='submit'>{t('edit')}</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
