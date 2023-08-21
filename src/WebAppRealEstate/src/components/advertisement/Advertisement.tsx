import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { DeleteIcon, StarIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  IconButton,
  Image,
  Stack,
  Text as Info,
  CardHeader,
  Box,
  CheckboxGroup,
  Checkbox,
  Grid,
  GridItem,
  Spinner,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { REAL_ESTATE_ENUM, REAL_ESTATE_VALUE_ENUM } from '@/enums';
import { DeleteModal } from '../common/DeleteModal';
import { AxiosResponse } from 'axios';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useChooseAdvertisementMutation, useDeleteAdvertisementMutation } from '@/services';
import { UserContext } from '@/contexts';
import { AdveretismentProps } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AdvertisementProps {
  ml?: string;
  isHomePage?: boolean;
  isMyAdvertisement?: boolean;
  isChosen?: boolean;
  advertisement: any;
  isLoading?: boolean;
};

const options = [
  { value: 'pasc', label: 'price ascending' },
  { value: 'pdesc', label: 'price descending' },
  { value: 'qasc', label: 'quadrature ascending' },
  { value: 'qdesc', label: 'quadrature descending' },
  { value: 'rdasc', label: 'realiseDate ascending' },
  { value: 'rddesc', label: 'realiseDate descending' },
] as const;

type Option = typeof options[number];

export const Advertisement = (props: AdvertisementProps) => {
  const [t] = useTranslation('common');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ids, setIds] = useState<number>(0);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const { currentUser } = useContext(UserContext);

  const { mutate: makeFavourite } = useChooseAdvertisementMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulEditUser', { response }) });
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulEditUser') });
    }
  });

  const handleSelectChange = (selectedOptions: Option | null) => {
    setSelectedOption(selectedOptions);
    if (selectedOption) {
      console.log('Selected option:', selectedOption.value);
    }
  };

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

  const sortItems = (items: any) => {
    switch (selectedOption?.value) {
      case 'pasc':
        return items.data.sort((a: any, b: any) => a.price.toString().localeCompare(b.price.toString()));
      case 'pdesc':
        return items.data.sort((a: any, b: any) => b.price.toString().localeCompare(a.price.toString()));
      case 'qasc':
        return items.data.sort((a: any, b: any) => a.quadrature.toString().localeCompare(b.quadrature.toString()));
      case 'qdesc':
        return items.data.sort((a: any, b: any) => b.quadrature.toString().localeCompare(a.quadrature.toString()));
      case 'rdasc':
        return items.data.sort((a: any, b: any) => a.realiseDate.toString().localeCompare(b.realiseDate.toString()));
      case 'rddesc':
        return items.data.sort((a: any, b: any) => b.realiseDate.toString().localeCompare(a.realiseDate.toString()));
      default:
        return items;
    }
  };

  const sortedItems = sortItems(props.advertisement);

  const [selectedValues1, setSelectedValues1] = useState<string[]>([]);
  const [selectedValues2, setSelectedValues2] = useState<string[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleCheckboxChange1 = (value: any) => {
    setSelectedValues1(value);
  };

  const handleCheckboxChange2 = (value: any) => {
    setSelectedValues2(value);
  };

  useEffect(() => {
    setIsFiltered(true);
    filterItems();
  }, [selectedValues1 ?? [], selectedValues2 ?? []]);

  const [filteredItems, setFilteredItems] = useState<any>();

  const filterItems = () => {
    setFilteredItems(props.advertisement?.data?.filter((x: any) => {
      const itemValues = Object.values(x);
      const match = itemValues.some((value: any) => {
        const stringValue = value === null ? '' : value.toString();
        return selectedValues1.includes(stringValue) || selectedValues2.includes(stringValue);
      });
      return match;
    }));
  };

  const { mutate: deleteAdvertisement } = useDeleteAdvertisementMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const handleDelete = () => {
    deleteAdvertisement(ids);
    setDeleteModalOpen(false);
  };

  const navigate = useNavigate();

  const newData = Array.isArray(props?.advertisement?.data)
    ? props.advertisement.data.flatMap((x: any) => x.images)
    : [];

  return (
    <>
      {!props?.isLoading && props?.advertisement ? (
        <>
          {props.isHomePage && (
            <>
              <Box w='200px' mt={3} ml={props.ml}>
                <Select
                  name='realEstateType'
                  options={options}
                  onChange={handleSelectChange}
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
              </Box>
              <Box bg='blue.200' ml={props.ml} mt={3} w='300px' borderRadius={5}>
                <Box style={{ display: 'flex', flexDirection: 'column', marginLeft: '1%' }}>
                  <CheckboxGroup value={selectedValues1} onChange={handleCheckboxChange1}>
                    {realEstateObjects.map((x) => (
                      <Checkbox
                        key={x.value}
                        value={x.value}
                        isChecked={selectedValues1.includes(x.value.toString())}
                        textColor='white'>
                        {x.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', marginLeft: '1%' }}>
                  <CheckboxGroup value={selectedValues2} onChange={handleCheckboxChange2}>
                    {realEstateValueObjects.map((x) => (
                      <Checkbox
                        key={x.value}
                        value={x.value}
                        isChecked={selectedValues2.includes(x.value.toString())}
                        textColor='white'>
                        {x.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </Box>
              </Box>
            </>
          )}
          <Wrap spacing={2}>
            {isFiltered && Array.isArray(filteredItems) ? (
              filteredItems.map((x: AdveretismentProps, index: number) => (
                <WrapItem key={index}>
                  <Card key={index} mt={3} mb={5} ml={props.ml} maxW='sm' backgroundColor='blue.200'>
                    <CardHeader>
                      <Grid display='flex' alignItems='flex-start' justifyContent='space-between'>
                        <GridItem>
                          <IconButton
                            key={index}
                            bg='none'
                            title={t('checked')}
                            _hover={{bg: 'none'}}
                            aria-label={''}
                            icon={<StarIcon color={(x.isFavourite && (currentUser?.firstName === x.createdBy)) ? 'yellow' : 'blue'}/>}
                          />
                        </GridItem>
                        <GridItem>
                          <Info
                            width={x.status === 2 ? '75px' : (x.status === 3 ? '40px' : '0px')}
                            backgroundColor={x.status === 2 ? 'green' : (x.status === 3 ? 'red' : '')}
                            textColor={'white'}>
                            {x.status === 2 ? 'PREMIUM' : (x.status === 3 ? 'TOP' : '')}
                          </Info>
                        </GridItem>
                      </Grid>
                    </CardHeader>
                    <CardBody>
                      <Stack textColor='white'>
                        <Heading size='md'>{x.title}</Heading>
                        {newData && newData
                          .filter((image: any) => image?.advertisementId === x.id)
                          .slice(0, 1)
                          .map((image: any) => (
                            <Box key={image.id}>
                              <Image
                                src={`data:${image.contentType};base64,${image.content}`}
                                alt={`Image ${image.id}`}
                                boxSize='200px'
                                height='100px'
                              />
                            </Box>
                          ))}
                        <Info fontSize={'2xl'}>{t('Realise date:')}</Info>
                        <Info fontSize='2xl'>
                          {format(new Date(x.realiseDate), 'dd-MM-yyyy')}
                        </Info>
                        <Info fontSize={'2xl'}>{'Quadrature:'}</Info>
                        <Info fontSize='2xl'>
                          {x.quadrature}
                        </Info>
                        <Info fontSize={'2xl'}>{'Price:'}</Info>
                        <Info fontSize='2xl'>
                          {x.price}
                        </Info>
                        <Info fontSize={'2xl'}>{'Description:'}</Info>
                        <Info fontSize='2xl'>
                          {x.description}
                        </Info>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button
                        variant='solid'
                        colorScheme='blue'
                        onClick={() => {
                          setIds(x.id);
                        }}>
                        {t('view')}
                      </Button>
                    </CardFooter>
                  </Card>
                </WrapItem>
              ))
            ) : (
              Array.isArray(props.advertisement?.data) && props.advertisement?.data?.map((x: any, index: any) => (
                <WrapItem key={index}>
                  <Card key={index} mt={3} mb={5} ml={props.ml} maxW='sm' backgroundColor='blue.200'>
                    <CardHeader>
                      <Grid display='flex' alignItems='flex-start' justifyContent='space-between'>
                        <GridItem>
                          <IconButton
                            key={index}
                            bg='none'
                            title={t('checked')}
                            _hover={{bg: 'none'}}
                            aria-label={''}
                            icon={<StarIcon color={(x.isFavourite && (currentUser?.firstName === x.createdBy)) ? 'yellow' : 'blue'}/>}
                          />
                        </GridItem>
                        <GridItem>
                          <Info
                            width={x.status === 2 ? '75px' : (x.status === 3 ? '40px' : '0px')}
                            backgroundColor={x.status === 2 ? 'green' : (x.status === 3 ? 'red' : '')}
                            textColor={'white'}>
                            {x.status === 2 ? 'PREMIUM' : (x.status === 3 ? 'TOP' : '')}
                          </Info>
                        </GridItem>
                        {!props.isChosen && (
                          <GridItem>
                            <IconButton
                              bg='none'
                              title={t('delete')}
                              _hover={{bg: 'blue.600'}}
                              aria-label={''}
                              icon={<DeleteIcon color={'white'}/>}
                              onClick={() => {
                                setDeleteModalOpen(true);
                                setIds(x.id);
                              }}
                            />
                          </GridItem>
                        )}
                      </Grid>
                    </CardHeader>
                    <CardBody>
                      <Stack spacing='3' textColor='white'>
                        <Heading size='md'>{x.title}</Heading>
                        {newData && newData
                          .filter((image: any) => image?.advertisementId === x.id)
                          .slice(0, 1)
                          .map((image: any) => (
                            <Box key={image.id}>
                              <Image src={`data:${image.contentType};base64,${image.content}`} alt={`Image ${image.id}`} />
                            </Box>
                          ))}
                        <Info fontSize={'2xl'}>{t('Realise date:')}</Info>
                        <Info fontSize='2xl'>
                          {format(new Date(x.realiseDate), 'dd-MM-yyyy')}
                        </Info>
                        <Info fontSize={'2xl'}>{'Quadrature:'}</Info>
                        <Info fontSize='2xl'>
                          {x.quadrature}
                        </Info>
                        <Info fontSize={'2xl'}>{'Price:'}</Info>
                        <Info fontSize='2xl'>
                          {x.price}
                        </Info>
                        <Info fontSize={'2xl'}>{'Description:'}</Info>
                        <Info fontSize='2xl'>
                          {x.description}
                        </Info>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button
                        variant='solid'
                        colorScheme='blue'
                        onClick={() => navigate(`/realEstateProfile/${parseInt(x.id, 10)}`)}>
                        {t('view')}
                      </Button>
                    </CardFooter>
                  </Card>
                </WrapItem>
              ))
            )}
          </Wrap>
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            handleDelete={handleDelete}
          />
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
