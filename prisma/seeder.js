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
        imageUrl: 'garuda.png',
        imageId: 'garuda-logo',
      },
      {
        name: 'Singapore Airlines',
        imageUrl: 'singapore-airlines.png',
        imageId: 'sia-logo',
      },
      {
        name: 'Qatar Airways',
        imageUrl: 'qatar-airways.png',
        imageId: 'qatar-logo',
      },
      { name: 'Emirates', imageUrl: 'emirates.png', imageId: 'emirates-logo' },
      { name: 'Qantas', imageUrl: 'qantas.png', imageId: 'qantas-logo' },
      { name: 'Delta Airlines', imageUrl: 'delta.png', imageId: 'delta-logo' },
      { name: 'Lion Air', imageUrl: 'lion-air.png', imageId: 'lion-logo' },
      { name: 'AirAsia', imageUrl: 'airasia.png', imageId: 'airasia-logo' },
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
        state: 'DKI Jakarta',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-6.1255',
        longitude: '106.6551',
        elevation: '8',
        imageUrl: 'cgk-airport.png',
      },
      {
        code: 'SUB',
        name: 'Juanda International Airport',
        city: 'Surabaya',
        state: 'East Java',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        latitude: '-7.3797',
        longitude: '112.7876',
        elevation: '7',
        imageUrl: 'sub-airport.png',
      },
      {
        code: 'DPS',
        name: 'Ngurah Rai International Airport',
        city: 'Denpasar',
        state: 'Bali',
        country: 'Indonesia',
        timezone: 'Asia/Makassar',
        latitude: '-8.7487',
        longitude: '115.1670',
        elevation: '4',
        imageUrl: 'dps-airport.png',
      },
      // International Airports
      {
        code: 'SIN',
        name: 'Singapore Changi Airport',
        city: 'Singapore',
        state: 'Central Singapore',
        country: 'Singapore',
        timezone: 'Asia/Singapore',
        latitude: '1.3644',
        longitude: '103.9915',
        elevation: '22',
        imageUrl: 'sin-airport.png',
      },
      {
        code: 'DOH',
        name: 'Hamad International Airport',
        city: 'Doha',
        state: 'Qatar',
        country: 'Qatar',
        timezone: 'Asia/Qatar',
        latitude: '25.2654',
        longitude: '51.6066',
        elevation: '5',
        imageUrl: 'doh-airport.png',
      },
      {
        code: 'JED',
        name: 'King Abdulaziz International Airport',
        city: 'Jeddah',
        state: 'Makkah',
        country: 'Saudi Arabia',
        timezone: 'Asia/Riyadh',
        latitude: '21.6820',
        longitude: '39.1606',
        elevation: '5',
        imageUrl: 'jed-airport.png',
      },
      {
        code: 'LAX',
        name: 'Los Angeles International Airport',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        latitude: '33.9416',
        longitude: '-118.4085',
        elevation: '38',
        imageUrl: 'lax-airport.png',
      },
      {
        code: 'SYD',
        name: 'Sydney Kingsford Smith Airport',
        city: 'Sydney',
        state: 'New South Wales',
        country: 'Australia',
        timezone: 'Australia/Sydney',
        latitude: '-33.9399',
        longitude: '151.1753',
        elevation: '6',
        imageUrl: 'syd-airport.png',
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
