import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Обработка регистрации
    console.log('Register data:', formData);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      sideTitle="Добро пожаловать в Kaban X"
      sideSubtitle="Войдите, чтобы управлять канбан доской и пользоваться инструментами!"
      sideButtonText="Войти"
      onSideButtonClick={handleLoginRedirect}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '40vw',
          '@media (max-width: 768px)': {
            maxWidth: '90vw',
          },
        }}
      >
        <TextField
          fullWidth
          placeholder="Логин"
          value={formData.login}
          onChange={handleChange('login')}
          sx={{
            width: '60%',
            marginBottom: '2vh',
            '& .MuiOutlinedInput-root': {
              padding: {
                xs: '2.5vh 2vw',
                md: '2.5vh 2vw',
                lg: '3vh 2vw',
              },
              borderRadius: '1vh',
              backgroundColor: '#242424',
              color: 'white',
              fontSize: {
                xs: '2.2vh',
                md: '2.2vh',
                lg: '2.5vh',
              },
              fontFamily: '"Times New Roman", Times, serif',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
                backgroundColor: '#444',
              },
              '& input::placeholder': {
                color: '#999',
                fontFamily: '"Times New Roman", Times, serif',
                textAlign: 'left',
              },
            },
            '@media (max-width: 768px)': {
              width: '70% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2.2vh 3vw',
                fontSize: '2vh',
                borderRadius: '1.5vh',
              },
            },
            '@media (max-width: 480px)': {
              width: '75% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2vh 4vw',
                fontSize: '1.9vh',
              },
            },
            '@media (max-width: 360px)': {
              width: '80% !important',
              '& .MuiOutlinedInput-root': {
                padding: '1.8vh 5vw',
                fontSize: '1.8vh',
              },
            },
          }}
        />

        <TextField
          fullWidth
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange('email')}
          sx={{
            width: '60%',
            marginBottom: '2vh',
            '& .MuiOutlinedInput-root': {
              padding: {
                xs: '2.5vh 2vw',
                md: '2.5vh 2vw',
                lg: '3vh 2vw',
              },
              borderRadius: '1vh',
              backgroundColor: '#242424',
              color: 'white',
              fontSize: {
                xs: '2.2vh',
                md: '2.2vh',
                lg: '2.5vh',
              },
              fontFamily: '"Times New Roman", Times, serif',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
                backgroundColor: '#444',
              },
              '& input::placeholder': {
                color: '#999',
                fontFamily: '"Times New Roman", Times, serif',
                textAlign: 'left',
              },
            },
            '@media (max-width: 768px)': {
              width: '70% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2.2vh 3vw',
                fontSize: '2vh',
                borderRadius: '1.5vh',
              },
            },
            '@media (max-width: 480px)': {
              width: '75% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2vh 4vw',
                fontSize: '1.9vh',
              },
            },
            '@media (max-width: 360px)': {
              width: '80% !important',
              '& .MuiOutlinedInput-root': {
                padding: '1.8vh 5vw',
                fontSize: '1.8vh',
              },
            },
          }}
        />

        <TextField
          fullWidth
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange('password')}
          sx={{
            width: '60%',
            marginBottom: '2vh',
            '& .MuiOutlinedInput-root': {
              padding: {
                xs: '2.5vh 2vw',
                md: '2.5vh 2vw',
                lg: '3vh 2vw',
              },
              borderRadius: '1vh',
              backgroundColor: '#242424',
              color: 'white',
              fontSize: {
                xs: '2.2vh',
                md: '2.2vh',
                lg: '2.5vh',
              },
              fontFamily: '"Times New Roman", Times, serif',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
                backgroundColor: '#444',
              },
              '& input::placeholder': {
                color: '#999',
                fontFamily: '"Times New Roman", Times, serif',
                textAlign: 'left',
              },
            },
            '@media (max-width: 768px)': {
              width: '70% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2.2vh 3vw',
                fontSize: '2vh',
                borderRadius: '1.5vh',
              },
            },
            '@media (max-width: 480px)': {
              width: '75% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2vh 4vw',
                fontSize: '1.9vh',
              },
            },
            '@media (max-width: 360px)': {
              width: '80% !important',
              '& .MuiOutlinedInput-root': {
                padding: '1.8vh 5vw',
                fontSize: '1.8vh',
              },
            },
          }}
        />

        <TextField
          fullWidth
          type="password"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          sx={{
            width: '60%',
            marginBottom: '2vh',
            '& .MuiOutlinedInput-root': {
              padding: {
                xs: '2.5vh 2vw',
                md: '2.5vh 2vw',
                lg: '3vh 2vw',
              },
              borderRadius: '1vh',
              backgroundColor: '#242424',
              color: 'white',
              fontSize: {
                xs: '2.2vh',
                md: '2.2vh',
                lg: '2.5vh',
              },
              fontFamily: '"Times New Roman", Times, serif',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
                backgroundColor: '#444',
              },
              '& input::placeholder': {
                color: '#999',
                fontFamily: '"Times New Roman", Times, serif',
                textAlign: 'left',
              },
            },
            '@media (max-width: 768px)': {
              width: '70% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2.2vh 3vw',
                fontSize: '2vh',
                borderRadius: '1.5vh',
              },
            },
            '@media (max-width: 480px)': {
              width: '75% !important',
              '& .MuiOutlinedInput-root': {
                padding: '2vh 4vw',
                fontSize: '1.9vh',
              },
            },
            '@media (max-width: 360px)': {
              width: '80% !important',
              '& .MuiOutlinedInput-root': {
                padding: '1.8vh 5vw',
                fontSize: '1.8vh',
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: '30%',
            padding: {
              xs: '2vh 0',
              md: '2vh 0',
              lg: '3vh 0',
            },
            border: '3px solid black',
            borderRadius: {
              xs: '3vh',
              md: '3vh',
              lg: '4vh',
            },
            backgroundColor: 'black',
            color: 'white',
            fontSize: {
              xs: '2vh',
              md: '2vh',
              lg: '2.8vh',
            },
            fontFamily: '"Times New Roman", Times, serif',
            transition: 'all 0.3s ease',
            marginTop: '1vh',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'black',
              border: '3px solid black',
            },
            '@media (max-width: 768px)': {
              width: '40% !important',
              padding: '2.5vh 0',
              fontSize: '2.5vh',
              borderRadius: '3vh',
              borderWidth: '2px',
              marginTop: '2vh',
            },
            '@media (max-width: 480px)': {
              width: '45% !important',
              padding: '2.2vh 0',
              fontSize: '2.2vh',
              borderRadius: '2.5vh',
            },
            '@media (max-width: 360px)': {
              width: '50% !important',
              padding: '2vh 0',
              fontSize: '2vh',
            },
          }}
        >
          Начать
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;