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
        role: UserRole.BUYER.VERIFIED,
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
      {
        name: 'American Airlines',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/American%20Airlines.png?updatedAt=1733415534954',
        imageId: 'american-logo',
      },
      {
        name: 'British Airways',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/British%20Airways.png?updatedAt=1733415535064',
        imageId: 'british-airways-logo',
      },
      {
        name: 'Air France',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/Air%20France.png?updatedAt=1733415534578',
        imageId: 'air-france-logo',
      },
      {
        name: 'Lufthansa',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/Lufthansa.png?updatedAt=1733415534884',
        imageId: 'lufthansa-logo',
      },
      {
        name: 'Turkish Airlines',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/Turkish%20Airlines.png?updatedAt=1733415534566',
        imageId: 'turkish-logo',
      },
      {
        name: 'KLM Royal Dutch Airlines',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airline/KLM%20Royal%20Dutch%20Airlines.png?updatedAt=1733415534970',
        imageId: 'klm-logo',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/Soekarno-Hatta%20International%20Airport.jpg?updatedAt=1733414621096',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/Juanda%20International%20Airport.jpg?updatedAt=1733414618295',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/Ngurah%20Rai%20International%20Airport.jpeg?updatedAt=1733414620132',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/Singapore%20Changi%20Airport.jpg?updatedAt=1733414620641',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/Hamad%20International%20Airport.jpg?updatedAt=1733414616334',
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
          'https://ik.imagekit.io/7z63pekkd/Airport/King%20Abdulaziz%20International%20Airport.jpg?updatedAt=1733414620222',
      },
      {
        code: 'LAX',
        name: 'Los Angeles International Airport',
        city: 'Los Angeles',
        state: 'Amerika',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        latitude: '33.9416',
        longitude: '-118.4085',
        elevation: '38',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Los%20Angeles%20International%20Airport.jpg?updatedAt=1733414618490',
      },
      {
        code: 'BDO',
        name: 'Husein Sastranegara International Airport',
        city: 'Bandung',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-6.9175',
        longitude: '107.6087',
        elevation: '747',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Husein%20Sastranegara%20International%20Airport.jpg?updatedAt=1733414615350',
      },
      {
        code: 'YOG',
        name: 'Adisutjipto International Airport',
        city: 'Yogyakarta',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-7.7824',
        longitude: '110.4233',
        elevation: '109',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Adisutjipto%20International%20Airport.jpg?updatedAt=1733414615626',
      },
      {
        code: 'PNK',
        name: 'Supadio International Airport',
        city: 'Pontianak',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Pontianak',
        latitude: '-0.0544',
        longitude: '109.3390',
        elevation: '4',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Supadio%20International%20Airport.jpg?updatedAt=1733414622115',
      },
      {
        code: 'DJB',
        name: 'Sultan Thaha Airport',
        city: 'Jambi',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-1.6347',
        longitude: '103.6443',
        elevation: '4',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Sultan%20Thaha%20Airport.jpg?updatedAt=1733414621481',
      },
      {
        code: 'MLG',
        name: 'Abdul Rachman Saleh Airport',
        city: 'Malang',
        state: 'Asia',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-7.9381',
        longitude: '112.6177',
        elevation: '495',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Abdul%20Rachman%20Saleh%20Airport.jpg?updatedAt=1733414615291',
      },
      {
        code: 'HKG',
        name: 'Hong Kong International Airport',
        city: 'Hong Kong',
        state: 'Asia',
        country: 'China',
        timezone: 'Asia/Hong_Kong',
        latitude: '22.3080',
        longitude: '113.9148',
        elevation: '6',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Hong%20Kong%20International%20Airport.jpg?updatedAt=1733414615118',
      },
      {
        code: 'DXB',
        name: 'Dubai International Airport',
        city: 'Dubai',
        state: 'Asia',
        country: 'UAE',
        timezone: 'Asia/Dubai',
        latitude: '25.2532',
        longitude: '55.3657',
        elevation: '62',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Dubai%20International%20Airport.jpg?updatedAt=1733414615341',
      },
      {
        code: 'ICN',
        name: 'Incheon International Airport',
        city: 'Seoul',
        state: 'Asia',
        country: 'South Korea',
        timezone: 'Asia/Seoul',
        latitude: '37.4602',
        longitude: '126.4407',
        elevation: '52',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Incheon%20International%20Airport.jpg?updatedAt=1733414617142',
      },
      {
        code: 'LHR',
        name: 'London Heathrow Airport',
        city: 'London',
        state: 'England',
        country: 'United Kingdom',
        timezone: 'Europe/London',
        latitude: '51.4700',
        longitude: '-0.4543',
        elevation: '25',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/London%20Heathrow%20Airport.jpg?updatedAt=1733414618449',
      },
      {
        code: 'AMS',
        name: 'Amsterdam Schiphol Airport',
        city: 'Amsterdam',
        state: 'North Holland',
        country: 'Netherlands',
        timezone: 'Europe/Amsterdam',
        latitude: '52.3086',
        longitude: '4.7639',
        elevation: '11',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Amsterdam%20Schiphol%20Airport.jpg?updatedAt=1733414615336',
      },
      {
        code: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France',
        timezone: 'Europe/Paris',
        latitude: '49.0097',
        longitude: '2.5479',
        elevation: '119',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Charles%20de%20Gaulle%20Airport.jpg?updatedAt=1733414615453',
      },
      {
        code: 'FRA',
        name: 'Frankfurt Airport',
        city: 'Frankfurt',
        state: 'Hesse',
        country: 'Germany',
        timezone: 'Europe/Berlin',
        latitude: '50.0379',
        longitude: '8.5622',
        elevation: '112',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Frankfurt%20Airport.jpg?updatedAt=1733414615490',
      },
      {
        code: 'MEL',
        name: 'Melbourne Airport',
        city: 'Melbourne',
        state: 'Victoria',
        country: 'Australia',
        timezone: 'Australia/Melbourne',
        latitude: '-37.6733',
        longitude: '144.8434',
        elevation: '134',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Melbourne%20Airport.jpg?updatedAt=1733414620520',
      },
      {
        code: 'JFK',
        name: 'John F. Kennedy International Airport',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        timezone: 'America/New_York',
        latitude: '40.6413',
        longitude: '-73.7781',
        elevation: '13',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/John%20F.%20Kennedy%20International%20Airport.jpg?updatedAt=1733414617940',
      },
      {
        code: 'YVR',
        name: 'Vancouver International Airport',
        city: 'Vancouver',
        state: 'British Columbia',
        country: 'Canada',
        timezone: 'America/Vancouver',
        latitude: '49.1937',
        longitude: '-123.1832',
        elevation: '4',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Vancouver%20International%20Airport.jpg?updatedAt=1733414624336',
      },
      {
        code: 'NRT',
        name: 'Narita International Airport',
        city: 'Narita',
        state: 'Chiba',
        country: 'Japan',
        timezone: 'Asia/Tokyo',
        latitude: '35.7734',
        longitude: '140.3929',
        elevation: '41',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Narita%20International%20Airport.jpg?updatedAt=1733414619425',
      },
      {
        code: 'SFO',
        name: 'San Francisco International Airport',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        latitude: '37.6213',
        longitude: '-122.3790',
        elevation: '4',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/San%20Francisco%20International%20Airport.jpg?updatedAt=1733414619875',
      },
      {
        code: 'BKK',
        name: 'Suvarnabhumi Airport',
        city: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        timezone: 'Asia/Bangkok',
        latitude: '13.6900',
        longitude: '100.7500',
        elevation: '5',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Suvarnabhumi%20Airport.jpg?updatedAt=1733414621980',
      },
      {
        code: 'ZRH',
        name: 'Zurich Airport',
        city: 'Zurich',
        state: 'Zurich',
        country: 'Switzerland',
        timezone: 'Europe/Zurich',
        latitude: '47.4647',
        longitude: '8.5492',
        elevation: '396',
        imageUrl:
          'https://ik.imagekit.io/7z63pekkd/Airport/Zurich%20Airport.jpg?updatedAt=1733414624031',
      },
    ],
  });

  // Retrieve airline and airport IDs for creating flights
  const retrievedAirlines = await prisma.airline.findMany();
  const retrievedAirports = await prisma.airport.findMany();

  // Seed Flights
  await prisma.flight.createMany({
    data: [
      // Jakarta to Singapore
      {
        flightNumber: 'GA123',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-07-15T08:00:00Z'),
        arrivalTime: parseISO('2024-07-15T11:00:00Z'),
        terminal: 'A',
        information: 'Direct flight from Jakarta to Singapore',
        price: 850.0,
        class: 'ECONOMY',
      },
      // Singapore to Jakarta
      {
        flightNumber: 'SQ456',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-07-16T14:30:00Z'),
        arrivalTime: parseISO('2024-07-16T17:30:00Z'),
        terminal: 'C',
        information: 'Return flight from Singapore to Jakarta',
        price: 900.0,
        class: 'BUSINESS',
      },
      // Surabaya to Doha
      {
        flightNumber: 'QR789',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        departureTime: parseISO('2024-07-17T22:00:00Z'),
        arrivalTime: parseISO('2024-07-18T01:30:00Z'),
        terminal: 'B',
        information: 'International flight from Surabaya to Doha',
        price: 1200.0,
        class: 'FIRST',
      },
      // Jakarta to Los Angeles
      {
        flightNumber: 'GA234',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        departureTime: parseISO('2024-08-01T10:00:00Z'),
        arrivalTime: parseISO('2024-08-01T21:30:00Z'),
        terminal: 'D',
        information: 'Direct flight from Jakarta to Los Angeles',
        price: 1500.0,
        class: 'ECONOMY',
      },
      // Los Angeles to Jakarta
      {
        flightNumber: 'SQ678',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-08-05T16:00:00Z'),
        arrivalTime: parseISO('2024-08-06T10:30:00Z'),
        terminal: 'A',
        information: 'Return flight from Los Angeles to Jakarta',
        price: 1600.0,
        class: 'FIRST',
      },
      // Surabaya to Singapore
      {
        flightNumber: 'SQ321',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        departureTime: parseISO('2024-07-19T06:00:00Z'),
        arrivalTime: parseISO('2024-07-19T09:00:00Z'),
        terminal: 'E',
        information: 'Direct flight from Surabaya to Singapore',
        price: 950.0,
        class: 'ECONOMY',
      },
      // Singapore to Surabaya
      {
        flightNumber: 'GA432',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SIN').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-07-20T12:30:00Z'),
        arrivalTime: parseISO('2024-07-20T14:00:00Z'),
        terminal: 'C',
        information: 'Return flight from Singapore to Surabaya',
        price: 920.0,
        class: 'BUSINESS',
      },
      // Jakarta to Sydney
      {
        flightNumber: 'QF789',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas Airways')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SYD').id,
        departureTime: parseISO('2024-08-02T07:00:00Z'),
        arrivalTime: parseISO('2024-08-02T17:30:00Z'),
        terminal: 'B',
        information: 'Direct flight from Jakarta to Sydney',
        price: 1300.0,
        class: 'ECONOMY',
      },
      // Sydney to Jakarta
      {
        flightNumber: 'QF321',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qantas Airways')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SYD').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-08-06T09:00:00Z'),
        arrivalTime: parseISO('2024-08-06T15:30:00Z'),
        terminal: 'D',
        information: 'Return flight from Sydney to Jakarta',
        price: 1350.0,
        class: 'BUSINESS',
      },
      // Denpasar to Los Angeles
      {
        flightNumber: 'GA987',
        airlineId: retrievedAirlines.find((a) => a.name === 'Garuda Indonesia')
          .id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DPS').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        departureTime: parseISO('2024-07-30T08:00:00Z'),
        arrivalTime: parseISO('2024-07-30T22:30:00Z'),
        terminal: 'E',
        information: 'Direct flight from Denpasar to Los Angeles',
        price: 1400.0,
        class: 'FIRST',
      },
      // Los Angeles to Denpasar
      {
        flightNumber: 'SQ112',
        airlineId: retrievedAirlines.find(
          (a) => a.name === 'Singapore Airlines'
        ).id,
        departureAirport: retrievedAirports.find((a) => a.code === 'LAX').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DPS').id,
        departureTime: parseISO('2024-08-05T16:30:00Z'),
        arrivalTime: parseISO('2024-08-06T08:00:00Z'),
        terminal: 'F',
        information: 'Return flight from Los Angeles to Denpasar',
        price: 1450.0,
        class: 'BUSINESS',
      },
      // Doha to Jeddah
      {
        flightNumber: 'QR567',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'JED').id,
        departureTime: parseISO('2024-07-25T20:00:00Z'),
        arrivalTime: parseISO('2024-07-25T22:00:00Z'),
        terminal: 'A',
        information: 'Direct flight from Doha to Jeddah',
        price: 1100.0,
        class: 'ECONOMY',
      },
      // Jeddah to Doha
      {
        flightNumber: 'QR876',
        airlineId: retrievedAirlines.find((a) => a.name === 'Qatar Airways').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'JED').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DOH').id,
        departureTime: parseISO('2024-07-27T14:30:00Z'),
        arrivalTime: parseISO('2024-07-27T16:00:00Z'),
        terminal: 'B',
        information: 'Return flight from Jeddah to Doha',
        price: 1150.0,
        class: 'FIRST',
      },
      // Surabaya to Kuala Lumpur
      {
        flightNumber: 'AK123',
        airlineId: retrievedAirlines.find((a) => a.name === 'AirAsia').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'KUL').id,
        departureTime: parseISO('2024-07-18T05:00:00Z'),
        arrivalTime: parseISO('2024-07-18T07:00:00Z'),
        terminal: 'A',
        information: 'Direct flight from Surabaya to Kuala Lumpur',
        price: 450.0,
        class: 'ECONOMY',
      },
      // Kuala Lumpur to Surabaya
      {
        flightNumber: 'AK321',
        airlineId: retrievedAirlines.find((a) => a.name === 'AirAsia').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'KUL').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'SUB').id,
        departureTime: parseISO('2024-07-19T08:30:00Z'),
        arrivalTime: parseISO('2024-07-19T09:30:00Z'),
        terminal: 'B',
        information: 'Return flight from Kuala Lumpur to Surabaya',
        price: 480.0,
        class: 'ECONOMY',
      },
      // Jakarta to Dubai
      {
        flightNumber: 'EK110',
        airlineId: retrievedAirlines.find((a) => a.name === 'Emirates').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'DXB').id,
        departureTime: parseISO('2024-08-03T23:00:00Z'),
        arrivalTime: parseISO('2024-08-04T06:30:00Z'),
        terminal: 'C',
        information: 'Direct flight from Jakarta to Dubai',
        price: 1100.0,
        class: 'BUSINESS',
      },
      // Dubai to Jakarta
      {
        flightNumber: 'EK210',
        airlineId: retrievedAirlines.find((a) => a.name === 'Emirates').id,
        departureAirport: retrievedAirports.find((a) => a.code === 'DXB').id,
        arrivalAirport: retrievedAirports.find((a) => a.code === 'CGK').id,
        departureTime: parseISO('2024-08-07T15:00:00Z'),
        arrivalTime: parseISO('2024-08-07T23:30:00Z'),
        terminal: 'D',
        information: 'Return flight from Dubai to Jakarta',
        price: 1200.0,
        class: 'FIRST',
      },
    ],
  });

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
