import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON, Circle, Marker } from 'react-leaflet';
import Select from 'react-select';
import AWS from 'aws-sdk';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Grid,
  GridItem,
  IconButton,
  Image,
  Text as Info,
  Input,
  Spinner,
  VStack
} from '@chakra-ui/react';
import L from 'leaflet';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { GeoJSONObject } from 'ol/format/GeoJSON';

import { EditAdvertisement, GeocoderLeaflet, MessageSender} from '@/components';
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
  initialAxiosResponse,
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
import { useChooseAdvertisementMutation, useGetAdvertisementQuery, useGetImagesByAvertisement, useGetUserById, usePublishAdvertisementPayMutation, useUploadImageMutation } from '@/services';
import { AxiosResponse } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '@/contexts';
import { useParams } from 'react-router-dom';
import { ADVERTISEMENT_ENUM } from '@/enums';

interface RealEstateProps {
  id?: any;
  features?: Feature<Geometry>[];
  addButton?: boolean;
};

export const RealEstateProfile = (props: RealEstateProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('common');
  const [isChecked, setIsChecked] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [isGasStation, setIsGasStation] = useState(false);
  const [isHealth, setIsHealth] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [isExchangeOffice, setIsExchangeOffice] = useState(false);
  const [isVrtici, setIsVrtici] = useState(false);
  const [isSupermarket, setIsSupermarket] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [radiusSet, setRadiusSet] = useState(0);
  const [idA, setIdA] = useState(0);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  let initialLatitude = 0;
  let initialLongitude = 0;

  const {data: myUser = initialAxiosResponse, isLoading: isLoadingUser} = useGetUserById(currentUser?.id ?? '');

  const parseId = parseInt(id ?? '', 10) || 0;
  const { data: realEstate, isLoading, refetch } = useGetAdvertisementQuery(parseId);

  initialLatitude = realEstate?.data?.address?.lat;
  initialLongitude = realEstate?.data?.address?.lng;

  const { mutate: makeFavourite } = useChooseAdvertisementMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulEditUser', { response }) });
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulEditUser') });
    }
  });

  const { mutate: uploadImage } = useUploadImageMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const statusObjects = Object.keys(ADVERTISEMENT_ENUM)
    .filter((v) => isNaN(Number(v)))
    .map((label) => {
      return {
        value: ADVERTISEMENT_ENUM[label as keyof typeof ADVERTISEMENT_ENUM],
        label: t(`${label}`) || label
      };
    });

  const handleImageUpload = async (event: { preventDefault: () => void; target: { files: any; }; }) => {
    event.preventDefault();
    const files = event.target.files;
    const formData = new FormData();
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('file', file);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const uploadedImageSrc = e.target && e.target.result;
          if (typeof uploadedImageSrc === 'string') {
            try {
              await uploadImageToS3(uploadedImageSrc);
            } catch (error) {
              console.error('Error uploading image to S3:', error);
            }
          }
        };
        reader.readAsDataURL(file);
      }
      try {
        const idAdv = parseId;
        logFormData(formData);
        const response = await uploadImage({ idAdv, file: formData });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logFormData = (formData: FormData) => {
    const entries = Array.from(formData.entries());
    for (const entry of entries) {
      console.log(entry[0], entry[1]);
    }
  };

  const uploadImageToS3 = async (imageDataUrl: string) => {
    const accessKeyId = 'AKIA6JW3FAJPQL6NLJPO';
    const secretAccessKey = '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';
    const region = 'eu-central-1';
    const bucketName = 'newrealestatebucket';

    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const arrayBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const fileName = `image_${new Date().getTime()}.png`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: blob,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
    };

    try {
      await s3.upload(params).promise();
      console.log('Image uploaded to S3 successfully');
    } catch (error) {
      console.error('Error uploading image to S3:', error);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const [position, setPosition] = useState({lat: 45.2428032, lng: 19.849218322071287});
  const markerRef = useRef<any>(null);
  const myAPIKey = 'b6618ad7359b4f779daeae7e35233c67';

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        refetch();
        const marker = markerRef.current;
        if (marker !== null) {
          setPosition({lat: 45.2428032, lng: 19.849218322071287});
        }
      },
    }),
    [],
  );

  useEffect(() => {
    refetch();
    const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${myAPIKey}`;
    fetch(reverseGeocodingUrl).then(result => result.json())
      .then(featureCollection => {
        console.log(featureCollection.features[0].properties);
      });
  }, [position]);

  const handleClickStar = () => {
    const payload = {
      id: realEstate?.data?.id,
      idUser: currentUser?.id ?? ''
    };
    makeFavourite(payload);
  };

  const { data: getUser = initialAxiosResponse } = useGetUserById(realEstate?.data?.userId);

  const {data: imagesData} = useGetImagesByAvertisement(parseId);

  const [statusOfAdv, setStatusOfAdv] = useState({ value: 1, label: 'STANDARD' });

  const { mutate: publishPay } = usePublishAdvertisementPayMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulStatusChangedt', { response }) });
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulStatusChangedt') });
    }
  });

  const handleStatusChange = () => {
    if (statusOfAdv.value === 2) {
      if (myUser && myUser?.data?.points < 4) {
        alert(t('alertBuyPoints'));
      } else {
        const isPublishedPay = {
          isPublished: true,
          values: statusOfAdv.value,
          userId: myUser.data.id
        };
        publishPay({ idAdvertisement: realEstate?.data?.id, payload: isPublishedPay });
      }
    } else if (statusOfAdv.value === 3) {
      if (myUser && myUser?.data?.points < 6) {
        alert(t('alertBuyPoints'));
      } else {
        const isPublishedPay = {
          isPublished: true,
          values: statusOfAdv.value,
          userId: myUser.data.id
        };
        publishPay({ idAdvertisement: realEstate?.data?.id, payload: isPublishedPay });
      }
    } else {
      alert('Your advertisement is standard!');
      const isPublishedPay = {
        isPublished: true,
        values: statusOfAdv.value,
        userId: myUser.data.id
      };
      publishPay({ idAdvertisement: realEstate?.data?.id, payload: isPublishedPay });
    }
  };

  const checkStatus = () => {
    if (realEstate?.data?.status === 1) {
      setStatusOfAdv({value: 1, label: 'STANDARD'});
    } else if (realEstate?.data?.status === 2) {
      setStatusOfAdv({value: 2, label: 'PREMIUM'});
    } else if (realEstate?.data?.status === 3) {
      setStatusOfAdv({value: 3, label: 'TOP'});
    }
  };

  useEffect(() => {
    checkStatus();
  }, [realEstate?.data?.status]);

  return (
    <>
      {!isLoading && realEstate?.data ? (
        <>
          <VStack p='2%'>
            <Info textColor='blue.800' fontSize='30'>{t('realEstateName')}</Info>
            {currentUser?.roleId === 1 && (
              <IconButton
                bg='blue.500'
                _hover={{bg: 'blue.600'}}
                color='white'
                onClick={() => {
                  setEditModalOpen(true);
                  setIdA(props.id);
                }}
                aria-label='edit'
                icon={<EditIcon />}
              />
            )}
            <Box
              p='2%'
              borderRadius='md'
              bg='blue.200'
              w='60%'
              textColor='white'
              h='60%'>
              <Info fontWeight='500' fontSize={'22'} ml={3} textColor='white'>{realEstate?.data?.title}</Info>
              <Box>
                <IconButton
                  bg='none'
                  title={t('checked')}
                  _hover={{bg: 'none'}}
                  aria-label={''}
                  icon={<StarIcon color={(realEstate?.data?.isFavourite && (currentUser?.firstName === realEstate?.data?.createdBy)) ? 'yellow' : 'blue'}/>}
                  onClick={handleClickStar}
                />
              </Box>
              {currentUser?.id === getUser?.data?.id && (
                <Box w='200px'>
                  <Select
                    name='status'
                    options={statusObjects}
                    defaultValue={realEstate?.data?.status}
                    onChange={(value: any) => setStatusOfAdv(value)}
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
                  <Button
                    mt={2}
                    mb={3}
                    bg='blue.500'
                    textColor='white'
                    _hover={{ bg: 'blue.600' }}
                    onClick={handleStatusChange}>
                    {t('changeStatus')}
                  </Button>
                </Box>
              )}
              <Grid display='flex' alignItems='flex-start' justifyContent='flex-start'>
                <GridItem>
                  <Box>
                    {(getUser?.data?.firstName === currentUser?.firstName) ? (
                      <>
                        <Grid display={'flex'} alignItems={'flex-start'} justifyContent={'inline'}>
                          <GridItem mt={170} mr={2}>
                            <IconButton
                              bg='blue.500'
                              _hover={{ bg: 'blue.600' }}
                              onClick={handlePreviousImage}
                              isDisabled={currentImageIndex === 0}
                              aria-label='Previous'
                              icon={<ChevronLeftIcon />}
                            />
                          </GridItem>
                          <GridItem>
                            {imagesData && imagesData?.data?.map((image: any, index: number) => (
                              <Box key={image.id} style={{ display: index === currentImageIndex ? 'block' : 'none' }}>
                                <Image style={{width: '600px', height: '400px'}} src={`data:${image.contentType};base64,${image.content}`} alt={`Image ${image.id}`} />
                              </Box>
                            ))}
                          </GridItem>
                          <GridItem mt={170} ml={2}>
                            <IconButton
                              bg='blue.500'
                              _hover={{ bg: 'blue.600' }}
                              onClick={handleNextImage}
                              aria-label='Next'
                              icon={<ChevronRightIcon />}
                            />
                          </GridItem>
                        </Grid>
                        <Input border='none' type='file' multiple onChange={handleImageUpload} />
                      </>
                    ) : (
                      <Grid display={'flex'} alignItems={'flex-start'} justifyContent={'inline'}>
                        <GridItem mt={170} mr={2}>
                          <IconButton
                            bg='blue.500'
                            _hover={{bg: 'blue.600'}}
                            onClick={handlePreviousImage}
                            isDisabled={currentImageIndex === 0}
                            aria-label='Previous'
                            icon={<ChevronLeftIcon />}
                          />
                        </GridItem>
                        <GridItem>
                          {imagesData && imagesData?.data?.map((image: any, index: number) => (
                            <Box key={image.id} style={{ display: index === currentImageIndex ? 'block' : 'none' }}>
                              <Image
                                style={{width: '600px', height: '400px'}}
                                src={`data:${image.contentType};base64,${image.content}`}
                                alt={`Image ${image.id}`}
                              />
                            </Box>
                          ))}
                        </GridItem>
                        <GridItem mt={170} ml={2}>
                          <IconButton
                            bg='blue.500'
                            _hover={{bg: 'blue.600'}}
                            onClick={handleNextImage}
                            aria-label='Next'
                            icon={<ChevronRightIcon />}
                          />
                        </GridItem>
                      </Grid>
                    )}
                  </Box>
                </GridItem>
                <GridItem ml={4}>
                  <Info fontWeight={'500'} textColor='white'>{t('quadrature')}</Info>
                  {`${realEstate?.data?.quadrature}${'m2'}`}
                </GridItem>
                <GridItem ml={4}>
                  <Info fontWeight={'500'} textColor='white'>{t('price')}</Info>
                  {`${realEstate?.data?.price}${'e'}`}
                </GridItem>
              </Grid>
              <Info textColor='white'>
                {realEstate?.data?.description}
              </Info>
              <Info fontWeight={'500'} fontSize={'20'} textColor={'white'}>{t('location')}</Info>
              <Box textColor='white'>
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
              {initialLatitude !== undefined && initialLongitude !== undefined ? (
                <MapContainer
                  id='seeLocation'
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
                    draggable={false}
                    position={{lat: initialLatitude, lng: initialLongitude}}
                    eventHandlers={eventHandlers}
                    icon={DefaultIcon}
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
                  {isChecked && (
                    <Circle center={[initialLatitude, initialLongitude]} radius={350} />
                  )}
                </MapContainer>
              ) : (
                <Spinner />
              )}
            </Box>
            {getUser?.data?.firstName === currentUser?.firstName ? (
              <Box></Box>
            ) : (currentUser?.roleId === 2 && (
              <Box
                p='2%'
                borderRadius='md'
                bg='blue.200'
                w='60%'
                h='60%'
                alignContent='center'>
                <Info textColor='white' fontSize='22' fontWeight={'500'} mb={3}>{t('contactPublisher')}</Info>
                <Info textColor='white'>{`${getUser?.data?.firstName} ${getUser?.data?.lastName}`}</Info>
                <Info textColor='white'>{`${getUser?.data?.phoneNumber}`}</Info>
                <Info textColor='white' fontSize='18'>{t('contact')}</Info>
                <Button
                  mt={3}
                  bg='blue.500'
                  textColor='white'
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => setModalOpen(true)}>
                  {t('sendMessage')}
                </Button>
              </Box>
            )
            )}
          </VStack>
          <MessageSender replier={getUser?.data?.id} modalOpen={modalOpen} onClose={() => setModalOpen(false)} />
          <EditAdvertisement
            modalOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            idAdvertisement={idA}
          />
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
