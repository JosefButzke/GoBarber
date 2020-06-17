import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';
import api from '../../services/api';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface RouteParams {
  providerId: string;
}

export interface Providers {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailablityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Providers[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);
  const [availablesDay, setAvailablesDay] = useState<AvailablityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    api.get('/providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => setAvailablesDay(response.data));
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    Platform.OS === 'android' && setShowDatePicker(false);

    date && setSelectedDate(date);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'ocorreu um erro ao criar um agendamento, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availablesDay
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availablesDay]);

  const afternoonAvailability = useMemo(() => {
    return availablesDay
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availablesDay]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(item) => item.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={selectedProvider === provider.id}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={selectedProvider === provider.id}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              textColor="#f4ede8"
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <Section>
              <SectionTitle>Manhã</SectionTitle>
              <SectionContent>
                {morningAvailability.map(
                  ({ formattedHour, available, hour }) => (
                    <Hour
                      enabled={available}
                      selected={selectedHour === hour}
                      available={available}
                      key={formattedHour}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </Hour>
                  ),
                )}
              </SectionContent>
            </Section>
          </Section>

          <Section>
            <Section>
              <SectionTitle>Tarde</SectionTitle>
            </Section>
            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={formattedHour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
