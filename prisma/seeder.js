import { parseISO } from 'date-fns';
import { prisma } from '../src/database/db.js';
import { Bcrypt } from '../src/utils/bcrypt.js';
import { UserRole, UserStatus } from '@prisma/client';

async function main() {
  // seed users
  const defaultPasswordHash = await Bcrypt.hash('password');

  // Seed Users with varied roles and statuses
  await prisma.user.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+62812345678',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'admin',
        lastName: 'uno legam',
        email: 'admin@unolegam.com',
        phone: '+62812345678',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.ADMIN,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+62887654321',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.ADMIN,
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+62811223344',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.UNVERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@example.com',
        phone: '+62822334455',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com',
        phone: '+62833445566',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        phone: '+62844556677',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
    ],
    skipDuplicates: true,
  });

  // Seed Airlines
  await prisma.airline.createMany({
    data: [
      {
        name: 'Garuda Indonesia',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/Garuda-Indonesia.jpg?updatedAt=1733030015025',
        imageId: 'garuda-logo',
      },
      {
        name: 'Singapore Airlines',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/singapore-airline.png?updatedAt=1733030014987',
        imageId: 'sia-logo',
      },
      {
        name: 'Qatar Airways',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/qatar%20airways.png?updatedAt=1733030014946',
        imageId: 'qatar-logo',
      },
      {
        name: 'Emirates',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/emirates.png?updatedAt=1733030014808',
        imageId: 'emirates-logo',
      },
      {
        name: 'Qantas',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/qantas.jpg?updatedAt=1733030014904',
        imageId: 'qantas-logo',
      },
      {
        name: 'Delta Airlines',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/delta%20airlines.png?updatedAt=1733030297967',
        imageId: 'delta-logo',
      },
      {
        name: 'Lion Air',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/lion-air.png?updatedAt=1733030014852',
        imageId: 'lion-logo',
      },
      {
        name: 'AirAsia',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airlines/air%20asia.png?updatedAt=1733030014916',
        imageId: 'airasia-logo',
      },
    ],
  });

  // Seed Airports
  await prisma.airport.createMany({
    data: [
      // Indonesia
      {
        code: 'CGK',
        name: 'Soekarno-Hatta International Airport',
        city: 'Jakarta',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-6.1255',
        longitude: '106.6551',
        elevation: '8',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/jakarta.jpg?updatedAt=1733579567527',
      },
      {
        code: 'SUB',
        name: 'Juanda International Airport',
        city: 'Surabaya',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-7.3797',
        longitude: '112.7876',
        elevation: '7',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/surabaya.jpg?updatedAt=1733579567180',
      },
      {
        code: 'DPS',
        name: 'Ngurah Rai International Airport',
        city: 'Denpasar',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Makassar',
        latitude: '-8.7487',
        longitude: '115.1670',
        elevation: '4',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/bali.jpg?updatedAt=1733579567375',
      },
      // International Airports
      {
        code: 'SIN',
        name: 'Singapore Changi Airport',
        city: 'Singapore',
        state: 'Asia',
        country: 'Singapore',
        timezone: 'Asia/Singapore',
        latitude: '1.3644',
        longitude: '103.9915',
        elevation: '22',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/singapura.jpg?updatedAt=1733579566914',
      },
      {
        code: 'DOH',
        name: 'Hamad International Airport',
        city: 'Doha',
        state: 'Asia',
        country: 'Qatar',
        timezone: 'Asia/Qatar',
        latitude: '25.2654',
        longitude: '51.6066',
        elevation: '5',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/doha.jpg?updatedAt=1733579567564',
      },
      {
        code: 'HKG',
        name: 'Hong Kong International Airport',
        city: 'Chek Lap Kok',
        state: 'Asia',
        country: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        latitude: '22.308046',
        longitude: '113.918480',
        elevation: '5',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/hongkong.jpg?updatedAt=1733579787581',
      },
      {
        code: 'JED',
        name: 'King Abdulaziz International Airport',
        city: 'Jeddah',
        state: 'Asia',
        country: 'Saudi Arabia',
        timezone: 'Asia/Riyadh',
        latitude: '21.6820',
        longitude: '39.1606',
        elevation: '5',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/jeddah.jpg?updatedAt=1733579567636',
      },
      {
        code: 'DXB',
        name: 'Dubai International Airport',
        city: 'Dubai',
        state: 'Asia',
        country: 'United Arab Emirates',
        timezone: 'Asia/Dubai',
        latitude: '25.276987',
        longitude: '55.296249',
        elevation: '2',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/dubai.jpg?updatedAt=1733579787752',
      },
      {
        code: 'LAX',
        name: 'Los Angeles International Airport',
        city: 'Los Angeles',
        state: 'America',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        latitude: '33.9416',
        longitude: '-118.4085',
        elevation: '38',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/los%20angeles.jpg?updatedAt=1733579570744',
      },
      {
        code: 'JFK',
        name: 'John F. Kennedy International Airport',
        city: 'New York',
        state: 'America',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        latitude: '40.6446',
        longitude: '-73.780968',
        elevation: '38',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/new%20york.jpg?updatedAt=1733579787735',
      },
      {
        code: 'SYD',
        name: 'Sydney Kingsford Smith Airport',
        city: 'Sydney',
        state: 'Australia',
        country: 'Australia',
        timezone: 'Australia/Sydney',
        latitude: '-33.9399',
        longitude: '151.1753',
        elevation: '6',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/sidney.jpg?updatedAt=1733579567038',
      },
      {
        code: 'LHR',
        name: 'London Heathrow Airport',
        city: 'London',
        state: 'Europe',
        country: 'United Kingdom',
        timezone: 'Europe/London',
        latitude: '51.4700',
        longitude: '-0.4543',
        elevation: '83 ft',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/london.jpg?updatedAt=1733579570646',
        imageId: 'lhr123',
      },
      {
        code: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        state: 'Europe',
        country: 'France',
        timezone: 'Europe/Paris',
        latitude: '49.0097',
        longitude: '2.5479',
        elevation: '392 ft',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/paris.jpg?updatedAt=1733579567152',
        imageId: 'cdg123',
      },
      {
        code: 'FRA',
        name: 'Frankfurt Airport',
        city: 'Frankfurt',
        state: 'Europe',
        country: 'Germany',
        timezone: 'Europe/Berlin',
        latitude: '50.0379',
        longitude: '8.5622',
        elevation: '364 ft',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/frankfurt.jpg?updatedAt=1733579567397',
        imageId: 'fra123',
      },
      {
        code: 'JNB',
        name: 'O. R. Tambo International Airport',
        city: 'Johannesburg',
        state: 'Africa',
        country: 'South Africa',
        timezone: 'Africa/Johannesburg',
        latitude: '-26.1419',
        longitude: '28.2421',
        elevation: '1677',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/johannesburg.jpg?updatedAt=1733579570067',
        imageId: '',
        createdAt: new Date(),
      },
      {
        code: 'CAI',
        name: 'Cairo International Airport',
        city: 'Cairo',
        state: 'Africa',
        country: 'Egypt',
        timezone: 'Africa/Cairo',
        latitude: '30.1219',
        longitude: '31.4057',
        elevation: '113',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/cairo.jpg?updatedAt=1733579567441',
        imageId: '',
        createdAt: new Date(),
      },
      {
        code: 'LOS',
        name: 'Murtala Muhammed International Airport',
        city: 'Lagos',
        state: 'Africa',
        country: 'Nigeria',
        timezone: 'Africa/Lagos',
        latitude: '6.5775',
        longitude: '3.3213',
        elevation: '35',
        imageUrl:
          'https://ik.imagekit.io/vieryn/airports/lagos.jpg?updatedAt=1733579570200',
        imageId: '',
        createdAt: new Date(),
      },
    ],
  });

  // Seed Flights
  const retrievedAirlines = await prisma.airline.findMany();
  const retrievedAirports = await prisma.airport.findMany();

  await prisma.flight.createMany({
    data: [
      {
        flightNumber: 'AH100',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-14T08:00:00Z'),
        arrivalTime: parseISO('2024-12-14T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'AH91',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-15T08:00:00Z'),
        arrivalTime: parseISO('2024-12-15T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'PREMIUM_ECONOMY',
      },
      {
        flightNumber: 'AL91',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-16T08:00:00Z'),
        arrivalTime: parseISO('2024-12-16T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'PREMIUM_ECONOMY',
      },
      {
        flightNumber: 'AH110',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-15T08:00:00Z'),
        arrivalTime: parseISO('2024-12-15T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'AH111',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-15T15:30:00Z'),
        arrivalTime: parseISO('2024-12-15T18:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'AH101',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-14T09:00:00Z'),
        arrivalTime: parseISO('2024-12-14T12:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'AH102',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-14T09:30:00Z'),
        arrivalTime: parseISO('2024-12-14T12:30:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 750.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'AH107',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-14T09:30:00Z'),
        arrivalTime: parseISO('2024-12-14T12:30:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 600.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'AH108',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-14T09:00:00Z'),
        arrivalTime: parseISO('2024-12-14T12:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 700.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'AH118',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-15T09:00:00Z'),
        arrivalTime: parseISO('2024-12-15T12:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'HA113',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-15T08:00:00Z'),
        arrivalTime: parseISO('2024-12-15T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'HA114',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-16T09:00:00Z'),
        arrivalTime: parseISO('2024-12-16T12:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'HA115',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-16T09:00:00Z'),
        arrivalTime: parseISO('2024-12-16T11:00:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 950.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'HA119',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T09:00:00Z'),
        arrivalTime: parseISO('2024-12-16T11:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 950.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'HA129',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-17T05:00:00Z'),
        arrivalTime: parseISO('2024-12-17T08:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 950.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'HA139',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-17T05:00:00Z'),
        arrivalTime: parseISO('2024-12-17T08:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'HA131',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-18T05:00:00Z'),
        arrivalTime: parseISO('2024-12-18T08:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'HA137',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-18T05:30:00Z'),
        arrivalTime: parseISO('2024-12-18T08:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA123',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-15T08:00:00Z'),
        arrivalTime: parseISO('2024-12-15T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 850.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA121',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-23T08:00:00Z'),
        arrivalTime: parseISO('2024-12-23T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 850.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA120',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-23T09:00:00Z'),
        arrivalTime: parseISO('2024-12-23T12:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA119',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-23T05:00:00Z'),
        arrivalTime: parseISO('2024-12-23T08:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA118',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-24T05:00:00Z'),
        arrivalTime: parseISO('2024-12-24T08:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA117',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-10T05:00:00Z'),
        arrivalTime: parseISO('2024-12-10T08:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA116',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-10T04:00:00Z'),
        arrivalTime: parseISO('2024-12-10T08:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ456',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GD456',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ455',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-17T14:30:00Z'),
        arrivalTime: parseISO('2024-12-17T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ454',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ453',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-18T14:30:00Z'),
        arrivalTime: parseISO('2024-12-18T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ452',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-19T14:30:00Z'),
        arrivalTime: parseISO('2024-12-19T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ450',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-20T15:30:00Z'),
        arrivalTime: parseISO('2024-12-20T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 800.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'SQ457',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ460',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-17T14:30:00Z'),
        arrivalTime: parseISO('2024-12-17T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ411',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-18T14:30:00Z'),
        arrivalTime: parseISO('2024-12-18T17:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'SQ458',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ401',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T11:30:00Z'),
        arrivalTime: parseISO('2024-12-16T12:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1100.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QR777',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        departureTime: parseISO('2024-12-17T22:00:00Z'),
        arrivalTime: parseISO('2024-12-18T01:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QR717',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JNB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CAI').id,
        departureTime: parseISO('2024-12-17T22:00:00Z'),
        arrivalTime: parseISO('2024-12-18T00:30:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QR719',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JNB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CAI').id,
        departureTime: parseISO('2024-12-17T22:00:00Z'),
        arrivalTime: parseISO('2024-12-18T00:30:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QR718',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JNB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CAI').id,
        departureTime: parseISO('2024-12-18T23:00:00Z'),
        arrivalTime: parseISO('2024-12-19T01:30:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA193',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-12-15T08:00:00Z'),
        arrivalTime: parseISO('2024-12-15T11:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 850.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ451',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ121',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-16T14:30:00Z'),
        arrivalTime: parseISO('2024-12-16T17:30:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'QR789',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        departureTime: parseISO('2024-12-17T22:00:00Z'),
        arrivalTime: parseISO('2024-12-18T01:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'NY789',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        departureTime: parseISO('2024-12-17T22:00:00Z'),
        arrivalTime: parseISO('2024-12-18T03:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'NY790',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        departureTime: parseISO('2024-12-18T22:00:00Z'),
        arrivalTime: parseISO('2024-12-19T03:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'NY791',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        departureTime: parseISO('2024-12-19T22:00:00Z'),
        arrivalTime: parseISO('2024-12-20T03:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1200.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA124',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-15T15:00:00Z'),
        arrivalTime: parseISO('2024-12-15T22:00:00Z'),
        terminal: 'D',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1400.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'SQ789',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'FRA').id,
        departureTime: parseISO('2024-12-16T10:00:00Z'),
        arrivalTime: parseISO('2024-12-16T16:00:00Z'),
        terminal: 'E',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QR100',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JNB').id,
        departureTime: parseISO('2024-12-17T23:30:00Z'),
        arrivalTime: parseISO('2024-12-18T06:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1250.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'QR101',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JNB').id,
        departureTime: parseISO('2024-12-16T23:30:00Z'),
        arrivalTime: parseISO('2024-12-17T06:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1250.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'EM206',
        airlineId: retrievedAirlines.find((a) => a.name === 'Emirates').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DXB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SYD').id,
        departureTime: parseISO('2024-12-18T18:00:00Z'),
        arrivalTime: parseISO('2024-12-19T17:30:00Z'),
        terminal: '3',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1600.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'QF2',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SYD').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        departureTime: parseISO('2024-12-19T22:00:00Z'),
        arrivalTime: parseISO('2024-12-20T18:00:00Z'),
        terminal: '1',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1900.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'DL5',
        airlineId: retrievedAirlines.find((a) => a.name === 'Delta Airlines')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        departureTime: parseISO('2024-12-20T07:30:00Z'),
        arrivalTime: parseISO('2024-12-20T15:00:00Z'),
        terminal: '2',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'DL6',
        airlineId: retrievedAirlines.find((a) => a.name === 'Delta Airlines')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        departureTime: parseISO('2024-12-20T07:30:00Z'),
        arrivalTime: parseISO('2024-12-20T15:00:00Z'),
        terminal: '2',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'DL9',
        airlineId: retrievedAirlines.find((a) => a.name === 'Delta Airlines')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JFK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        departureTime: parseISO('2024-12-20T01:30:00Z'),
        arrivalTime: parseISO('2024-12-20T06:00:00Z'),
        terminal: '2',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 550.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'CG921',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-24T09:30:00Z'),
        arrivalTime: parseISO('2024-12-24T12:15:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'CG911',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-23T09:30:00Z'),
        arrivalTime: parseISO('2024-12-23T12:15:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'CG912',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-22T23:30:00Z'),
        arrivalTime: parseISO('2024-12-23T01:15:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'CG9113',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-27T23:30:00Z'),
        arrivalTime: parseISO('2024-12-28T01:15:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 860.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'CG942',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-27T23:30:00Z'),
        arrivalTime: parseISO('2024-12-28T01:15:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 860.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'CG942',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-26T23:30:00Z'),
        arrivalTime: parseISO('2024-12-27T01:15:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 700.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'CG941',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-26T19:30:00Z'),
        arrivalTime: parseISO('2024-12-26T23:15:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 700.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA300',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA092',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-21T09:30:00Z'),
        arrivalTime: parseISO('2024-12-21T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA1E2',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-22T09:30:00Z'),
        arrivalTime: parseISO('2024-12-22T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA0T2',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-22T09:30:00Z'),
        arrivalTime: parseISO('2024-12-22T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 520.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA0T1',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-23T09:30:00Z'),
        arrivalTime: parseISO('2024-12-23T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 520.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA0T9',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-24T09:30:00Z'),
        arrivalTime: parseISO('2024-12-24T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 520.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA0T9',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-25T09:30:00Z'),
        arrivalTime: parseISO('2024-12-25T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 520.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA0T9',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-26T09:30:00Z'),
        arrivalTime: parseISO('2024-12-26T14:00:00Z'),
        terminal: 'C',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 520.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA0P9',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-26T09:30:00Z'),
        arrivalTime: parseISO('2024-12-26T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 920.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA0P12',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-26T09:00:00Z'),
        arrivalTime: parseISO('2024-12-26T13:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA0P19',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-21T09:00:00Z'),
        arrivalTime: parseISO('2024-12-21T13:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GACP19',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-19T22:30:00Z'),
        arrivalTime: parseISO('2024-12-20T01:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GACP29',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-20T22:30:00Z'),
        arrivalTime: parseISO('2024-12-21T01:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GACP21',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-20T22:30:00Z'),
        arrivalTime: parseISO('2024-12-21T01:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 510.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GACP26',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-21T22:30:00Z'),
        arrivalTime: parseISO('2024-12-22T01:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 510.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA301',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1050.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA200',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 700.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'GA201',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1300.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'GA202',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1000.0,
        class: 'BUSINESS',
      },
      {
        flightNumber: 'GA201',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'HKG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-20T09:30:00Z'),
        arrivalTime: parseISO('2024-12-20T14:00:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 700.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'SQ123',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DXB').id,
        departureTime: parseISO('2024-12-21T14:00:00Z'),
        arrivalTime: parseISO('2024-12-21T20:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1100.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'DS191',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DXB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-09-21T14:00:00Z'),
        arrivalTime: parseISO('2024-09-21T20:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1100.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PR124',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        departureTime: parseISO('2024-12-21T14:00:00Z'),
        arrivalTime: parseISO('2024-12-21T20:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 1100.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PR123',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T14:00:00Z'),
        arrivalTime: parseISO('2024-12-21T20:30:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PR110',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T14:00:00Z'),
        arrivalTime: parseISO('2024-12-21T19:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PR1',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T08:00:00Z'),
        arrivalTime: parseISO('2024-12-21T14:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PR2',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-21T08:00:00Z'),
        arrivalTime: parseISO('2024-12-21T14:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PD11',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-24T08:00:00Z'),
        arrivalTime: parseISO('2024-12-24T14:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PD121',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-25T08:00:00Z'),
        arrivalTime: parseISO('2024-12-25T13:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PS1E1',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-26T08:00:00Z'),
        arrivalTime: parseISO('2024-12-26T12:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PP1E1',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-30T23:00:00Z'),
        arrivalTime: parseISO('2024-12-31T01:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 400.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PFSE1',
        airlineId: retrievedAirlines.find((a) => a.name === 'Lion Air').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-30T23:00:00Z'),
        arrivalTime: parseISO('2024-12-31T01:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PFSE1',
        airlineId: retrievedAirlines.find((a) => a.name === 'AirAsia').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-12-30T23:00:00Z'),
        arrivalTime: parseISO('2024-12-31T01:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PFSE1',
        airlineId: retrievedAirlines.find((a) => a.name === 'AirAsia').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-12-31T23:00:00Z'),
        arrivalTime: parseISO('2025-01-01T01:45:00Z'),
        terminal: 'A',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PD100',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T08:00:00Z'),
        arrivalTime: parseISO('2024-12-21T14:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PD101',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T05:00:00Z'),
        arrivalTime: parseISO('2024-12-21T11:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 500.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'AD121',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-22T23:45:00Z'),
        arrivalTime: parseISO('2024-12-23T03:40:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 850.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'AD122',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-24T23:45:00Z'),
        arrivalTime: parseISO('2024-12-25T03:40:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 850.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PD122',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-24T23:50:00Z'),
        arrivalTime: parseISO('2024-12-25T03:48:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 450.0,
        class: 'ECONOMY',
      },
      {
        flightNumber: 'PR2',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-21T09:00:00Z'),
        arrivalTime: parseISO('2024-12-21T15:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
      {
        flightNumber: 'PR3',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CDG').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LHR').id,
        departureTime: parseISO('2024-12-16T22:00:00Z'),
        arrivalTime: parseISO('2024-12-17T03:45:00Z'),
        terminal: 'B',
        information: 'Free Wi Fi-Free Inflight Meals',
        price: 900.0,
        class: 'FIRST',
      },
    ],
  });

  const seatData = [];
  const flights = await prisma.flight.findMany();

  // Seed Seats
  flights.forEach((flight) => {
    const numberOfRows = 12;
    const seatsPerRow = 6;
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let row = 1; row <= numberOfRows; row++) {
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = `${row}${seatLetters[col]}`; // Contoh: 1A, 1B, ..., 10F
        seatData.push({
          flightId: flight.id,
          seatNumber: seatNumber,
          status: 'AVAILABLE',
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
        });
      }
    }
  });

  await prisma.seat.createMany({
    data: seatData,
    skipDuplicates: true,
  });

  // Seed Passenger
  await prisma.passenger.createMany({
    data: Array.from({ length: 10 }).map((_, index) => ({
      name: `Passenger ${index + 1}`,
      familyName: `Passenger Family ${index + 1}`,
      gender: index % 2 === 0 ? 'MALE' : 'FEMALE',
      identityNumber: `${1000000000000 + index}`,
      citizenship: 'Indonesia',
      countryOfIssue: 'Indonesia',
      title: index % 3 === 0 ? 'Mr' : 'Mrs',
      dob: new Date(1970 + Math.floor(index / 2), index % 12, index + 1),
      expiredDate: new Date(2030, index % 12, index + 1),
      type: 'ADULT',
    })),
    skipDuplicates: true,
  });

  // Seed Booking
  await prisma.booking.createMany({
    data: Array.from({ length: 5 }).map((_, index) => ({
      code: `BK-${index + 1}`,
      userId: 1,
      flightId: 1,
      returnFlightId: 2,
      bookingDate: new Date(2024, index, index + 1),
      totalPrice: 1000000 + index * 500000,
      status: 'ACTIVE',
    })),
    skipDuplicates: true,
  });

  // Seed Booking Details
  const bookingDetailsData = [];
  const seatIds = await prisma.seat.findMany({
    where: { status: 'AVAILABLE' },
  });

  Array.from({ length: 5 }).forEach((_, index) => {
    const selectedSeat = seatIds[index];
    if (selectedSeat) {
      bookingDetailsData.push({
        bookingId: index + 1,
        passengerId: index + 1,
        seatId: selectedSeat.id,
        price: 500000 + index * 250000,
      });

      prisma.seat.update({
        where: { id: selectedSeat.id },
        data: { status: 'UNAVAILABLE' },
      });
    }
  });

  await prisma.bookingDetail.createMany({
    data: bookingDetailsData,
    skipDuplicates: true,
  });

  // Seed Payments
  const paymentData = [];
  const bookings = await prisma.booking.findMany();

  bookings.forEach((booking, index) => {
    const paymentstatus = ['settlement', 'pending', 'cancel', 'expire'][
      index % 4
    ];

    const paymentType =
      index % 4 === 0
        ? 'credit_card'
        : index % 4 === 1
          ? 'bank_transfer'
          : index % 4 === 2
            ? 'digital_walet'
            : 'paypal';

    paymentData.push({
      orderId: crypto.randomUUID(),
      bookingId: booking.id,
      userId: booking.userId,
      snapToken: `SNAP-${booking.id}-${Date.now()}`,
      type: paymentType,
      amount: booking.totalPrice,
      status: paymentstatus,
    });
  });

  await prisma.payment.createMany({
    data: paymentData,
    skipDuplicates: true,
  });

  // Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: 'INFO',
        title: 'Selamat Datang di Layanan Pemesanan Tiket Kami!',
        description:
          'Terima kasih telah bergabung. Dapatkan info terbaru dan promo menarik dari kami.',
        isRead: false,
      },
      {
        type: 'ACCOUNT',
        title: 'Verifikasi Akun Berhasil!',
        description:
          'Selamat, akun anda berhasil terverifikasi!. Nikmati penerbangan penuh adrenalin bersama kami.',
        isRead: false,
        userId: 1,
      },
      {
        type: 'DISCOUNT',
        title: 'Promo Spesial untuk Anda!',
        description:
          'Dapatkan diskon 20% untuk pemesanan tiket berikutnya. Berlaku untuk waktu terbatas.',
        isRead: false,
      },
      {
        type: 'EVENT',
        title: 'Pemberitahuan Perubahan Jadwal Penerbangan',
        description:
          'Perhatikan perubahan jadwal penerbangan terbaru Anda. Periksa detailnya di sini.',
        isRead: false,
      },
      {
        type: 'PAYMENT',
        title: 'Notifikasi Pembayaran Palsu',
        description:
          'Pembayaran Anda telah berhasil diproses. Terima kasih telah memesan tiket dengan kami.',
        isRead: true,
        userId: 1,
      },
      {
        type: 'INFO',
        title: 'Fitur Baru Telah Diluncurkan!',
        description:
          'Nikmati fitur pencarian penerbangan yang lebih cepat dan mudah. Coba sekarang!',
        isRead: false,
      },
      {
        type: 'DISCOUNT',
        title: 'Flash Sale: Diskon Tiket Terbatas!',
        description:
          'Pesan tiket penerbangan favorit Anda dengan harga diskon. Penawaran terbatas!',
        isRead: false,
      },
      {
        type: 'ACCOUNT',
        title: 'Perubahan Kata Sandi Berhasil',
        description:
          'Anda telah berhasil mengubah kata sandi akun pemesanan tiket Anda.',
        isRead: true,
        userId: 2,
      },
      {
        type: 'EVENT',
        title: 'Pengumuman: Penundaan Penerbangan',
        description:
          'Penerbangan Anda mengalami penundaan. Periksa pembaruan terbaru di aplikasi kami.',
        isRead: false,
      },
      {
        type: 'PAYMENT',
        title: 'Notifikasi Pembayaran Palsu',
        description:
          'Pembayaran Anda telah berhasil diproses. Terima kasih telah memesan tiket dengan kami.',
        isRead: true,
        userId: 2,
      },
    ],
  });

  // Seed Discount
  const discountData = [
    {
      name: 'New Year Sale',
      type: 'percentage',
      value: 20,
      minPurchase: 100,
      isActive: true,
      description: 'Celebrate the New Year with a 20% discount on all items!',
    },
    {
      name: 'Black Friday Deal',
      type: 'percentage',
      value: 50,
      minPurchase: 500,
      isActive: true,
      description: 'Black Friday Deal with 50% off!',
    },
    {
      name: 'Free Shipping',
      type: 'fixed',
      value: 0.0,
      minPurchase: 30,
      isActive: true,
      description: 'Get free shipping for orders above $30!',
    },
    {
      name: 'Holiday Special',
      type: 'fixed',
      value: 10,
      minPurchase: 400,
      isActive: true,
      description: 'Enjoy a $10 discount for the holiday season!',
    },
    {
      name: 'Flash Sale',
      type: 'percentage',
      value: 15,
      minPurchase: null,
      isActive: true,
      description: 'One-day flash sale with 15% off on all items!',
    },
  ];

  for (const discount of discountData) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const discountWithDates = {
      ...discount,
      startDate: startDate,
      endDate: endDate,
      code: generateRandomCode(8),
    };

    await prisma.discount.create({
      data: discountWithDates,
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
