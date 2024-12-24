import { prisma } from '../src/database/db.js';
import { Bcrypt } from '../src/utils/bcrypt.js';
import { UserRole, UserStatus } from '@prisma/client';

async function main() {
  // seed users
  console.log('🚀 Seeding Start');
  console.log('seeding users...');
  const defaultPasswordHash = await Bcrypt.hash('password');

  // Seed Users with varied roles and statuses
  await prisma.user.createMany({
    data: [
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
        firstName: 'Dhiya Ul',
        lastName: 'Faruq',
        email: 'dhiyaulfaruq@unolegam.com',
        phone: '+62812345678',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Michael Joenathan',
        lastName: 'Darwin',
        email: 'michaeljoenathandarwin@unolegam.com',
        phone: '+62887654321',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Naila Jinan',
        lastName: 'Gaisani',
        email: 'nailajinangaisani@unolegam.com',
        phone: '+62811223344',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.UNVERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Muhammad Fadhillah',
        lastName: 'Rahman',
        email: 'muhammadfadhillahrahman@unolegam.com',
        phone: '+62811223344',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.UNVERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Naufal Azmi',
        lastName: 'Ginting',
        email: 'naufalazmiginting@unolegam.com',
        phone: '+62822334455',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Viery',
        lastName: 'Nugroho',
        email: 'vierynugroho@unolegam.com',
        phone: '+62833445566',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Salsabilla',
        lastName: 'Aulia',
        email: 'salsabillaaulia@unolegam.com',
        phone: '+62844556677',
        password: defaultPasswordHash,
        secretKey: '',
        otpToken: '',
        status: UserStatus.VERIFIED,
        role: UserRole.BUYER,
      },
      {
        firstName: 'Yogi Hafidh',
        lastName: 'Maulana',
        email: 'yogihafidhmaulana@unolegam.com',
        phone: '+62834516192',
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
  console.log('seeding airlines...');
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
  console.log('seeding airports...');
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
  console.log('seeding flights...');
  const BATCH_SIZE = 1000;
  const airlines = await prisma.airline.findMany();
  const airports = await prisma.airport.findMany();

  // Define flight routes
  const routes = [];
  for (const departure of airports) {
    for (const arrival of airports) {
      if (departure.id !== arrival.id) {
        routes.push({
          departure: departure,
          arrival: arrival,
        });
      }
    }
  }

  // Define class variations with their price multipliers
  const classVariations = [
    { class: 'ECONOMY', multiplier: 1 },
    { class: 'PREMIUM_ECONOMY', multiplier: 1.8 },
    { class: 'BUSINESS', multiplier: 2.5 },
    { class: 'FIRST', multiplier: 4 },
  ];

  // Base prices for different route lengths (in IDR)
  const getBasePrice = (departure, arrival) => {
    // Enhanced pricing logic
    if (departure.city === arrival.city) return 800000 + Math.random() * 200000;
    if (departure.country === arrival.country) {
      // Domestic flights with variation
      return 1500000 + Math.random() * 500000;
    }
    if (departure.region === arrival.region) {
      // Regional flights with variation
      return 3000000 + Math.random() * 1000000;
    }
    // International flights with variation
    return 8000000 + Math.random() * 2000000;
  };

  // Generate flight schedules
  const generateFlightTimes = (date) => {
    const times = [];
    // Generate flights from 00:00 to 23:59
    // More flights during peak hours (morning and evening)

    for (let hour = 9; hour < 10; hour++) {
      const flightsPerHour = Math.floor(Math.random() * 1) + 1;
      for (let i = 0; i < flightsPerHour; i++) {
        times.push(
          new Date(date.setHours(hour, Math.floor(Math.random() * 60)))
        );
      }
    }

    for (let hour = 15; hour < 16; hour++) {
      const flightsPerHour = Math.floor(Math.random() * 1) + 1;
      for (let i = 0; i < flightsPerHour; i++) {
        times.push(
          new Date(date.setHours(hour, Math.floor(Math.random() * 60)))
        );
      }
    }

    return times.sort((a, b) => a - b);
  };

  const startDate = new Date('2024-12-25');
  const endDate = new Date('2025-01-05');

  // Process in smaller chunks to manage memory
  const processDateRange = async (start, end) => {
    const flights = [];
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      for (const route of routes) {
        const flightTimes = generateFlightTimes(new Date(date));

        for (const departureTime of flightTimes) {
          // Randomly select airline
          const airline = airlines[Math.floor(Math.random() * airlines.length)];

          // Calculate flight duration based on route type
          let flightDuration;
          if (route.departure.country === route.arrival.country) {
            flightDuration = 1 + Math.random(); // 1-2 hours for domestic
          } else if (route.departure.region === route.arrival.region) {
            flightDuration = 2 + Math.random() * 2; // 2-4 hours for regional
          } else {
            flightDuration = 4 + Math.random() * 8; // 4-12 hours for international
          }

          const arrivalTime = new Date(departureTime);
          arrivalTime.setHours(
            arrivalTime.getHours() + Math.floor(flightDuration)
          );
          arrivalTime.setMinutes(
            arrivalTime.getMinutes() + (flightDuration % 1) * 60
          );

          // Generate terminal (A, B, C, or D)
          const terminal = String.fromCharCode(
            65 + Math.floor(Math.random() * 4)
          );

          // Calculate base price
          const basePrice = getBasePrice(route.departure, route.arrival);

          // Generate flights for each class
          for (const classVar of classVariations) {
            const flight = {
              flightNumber: `${airline.id}${route.departure.code}${Math.floor(Math.random() * 9000) + 1000}`,
              airlineId: airline.id,
              departureAirport: route.departure.id,
              arrivalAirport: route.arrival.id,
              departureTime: new Date(departureTime),
              arrivalTime: new Date(arrivalTime),
              terminal,
              information: `Free in-flight meals and wifi`,
              price: Math.round(basePrice * classVar.multiplier),
              class: classVar.class,
            };

            flights.push(flight);
          }
        }
      }
    }
    return flights;
  };

  // Process and insert in chunks of 7 days
  const chunkSize = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  for (
    let chunkStart = startDate;
    chunkStart < endDate;
    chunkStart = new Date(chunkStart.getTime() + chunkSize)
  ) {
    const chunkEnd = new Date(
      Math.min(chunkStart.getTime() + chunkSize, endDate.getTime())
    );

    const chunkFlights = await processDateRange(chunkStart, chunkEnd);

    // Insert in batches of 1000
    for (let i = 0; i < chunkFlights.length; i += BATCH_SIZE) {
      const batch = chunkFlights.slice(i, i + BATCH_SIZE);
      await prisma.flight.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  }

  // Constants for seat configuration
  console.log('seeding seats...');
  const numberOfRows = 12;
  const seatsPerRow = 6;
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Get total number of flights
  const totalFlights = await prisma.flight.count();

  // Process flights in batches
  for (
    let flightOffset = 0;
    flightOffset < totalFlights;
    flightOffset += BATCH_SIZE
  ) {
    // Get batch of flights
    const flights = await prisma.flight.findMany({
      skip: flightOffset,
      take: BATCH_SIZE,
      select: {
        id: true,
        departureTime: true,
        arrivalTime: true,
      },
    });

    // Generate seats for current flight batch
    const seatData = [];

    flights.forEach((flight) => {
      for (let row = 1; row <= numberOfRows; row++) {
        for (let col = 0; col < seatsPerRow; col++) {
          const seatNumber = `${row}${seatLetters[col]}`;
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

    // Insert seats in smaller batches
    for (let i = 0; i < seatData.length; i += BATCH_SIZE) {
      const batch = seatData.slice(i, i + BATCH_SIZE);
      await prisma.seat.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }

    // Clear seatData array to free up memory
    seatData.length = 0;
  }

  //  // Seed Passenger
  // console.log('seeding passengers...');
  // await prisma.passenger.createMany({
  //   data: Array.from({ length: 10 }).map((_, index) => ({
  //     name: `Passenger ${index + 1}`,
  //     familyName: `Passenger Family ${index + 1}`,
  //     gender: index % 2 === 0 ? 'MALE' : 'FEMALE',
  //     identityNumber: `${1000000000000 + index}`,
  //     citizenship: 'Indonesia',
  //     countryOfIssue: 'Indonesia',
  //     title: index % 3 === 0 ? 'Mr' : 'Mrs',
  //     dob: new Date(1970 + Math.floor(index / 2), index % 12, index + 1),
  //     expiredDate: new Date(2030, index % 12, index + 1),
  //     type: 'ADULT',
  //   })),
  //   skipDuplicates: true,
  // });

  // // Seed Booking
  // console.log('seeding bookings...');
  // await prisma.booking.createMany({
  //   data: Array.from({ length: 5 }).map((_, index) => ({
  //     code: `BK-${index + 1}`,
  //     userId: 1,
  //     flightId: 1,
  //     returnFlightId: 2,
  //     bookingDate: new Date(2024, index, index + 1),
  //     totalPrice: 1000000 + index * 500000,
  //     status: 'ACTIVE',
  //   })),
  //   skipDuplicates: true,
  // });

  // // Seed Booking Details
  // console.log('seeding booking details...');
  // const bookingDetailsData = [];
  // const seatIds = await prisma.seat.findMany({
  //   where: { status: 'AVAILABLE' },
  // });

  // Array.from({ length: 5 }).forEach((_, index) => {
  //   const selectedSeat = seatIds[index];
  //   if (selectedSeat) {
  //     bookingDetailsData.push({
  //       bookingId: index + 1,
  //       passengerId: index + 1,
  //       seatId: selectedSeat.id,
  //       price: 500000 + index * 250000,
  //     });

  //     prisma.seat.update({
  //       where: { id: selectedSeat.id },
  //       data: { status: 'UNAVAILABLE' },
  //     });
  //   }
  // });

  // await prisma.bookingDetail.createMany({
  //   data: bookingDetailsData,
  //   skipDuplicates: true,
  // });

  // // Seed Payments
  // console.log('seeding payments...');
  // const paymentData = [];
  // const bookings = await prisma.booking.findMany();

  // bookings.forEach((booking, index) => {
  //   const paymentstatus = ['settlement', 'pending', 'cancel', 'expire'][
  //     index % 4
  //   ];

  //   const paymentType =
  //     index % 4 === 0
  //       ? 'credit_card'
  //       : index % 4 === 1
  //         ? 'bank_transfer'
  //         : index % 4 === 2
  //           ? 'digital_walet'
  //           : 'paypal';

  //   paymentData.push({
  //     orderId: crypto.randomUUID(),
  //     bookingId: booking.id,
  //     userId: booking.userId,
  //     snapToken: `SNAP-${booking.id}-${Date.now()}`,
  //     type: paymentType,
  //     amount: booking.totalPrice,
  //     status: paymentstatus,
  //   });
  // });

  // await prisma.payment.createMany({
  //   data: paymentData,
  //   skipDuplicates: true,
  // });

  // Seed Notifications
  console.log('seeding notifications...');
  await prisma.notification.createMany({
    data: [
      {
        type: 'INFO',
        title: 'Welcome to Our Ticket Booking Service!',
        description:
          'Thank you for joining us. Get the latest updates and exciting promotions.',
        isRead: false,
      },
      {
        type: 'ACCOUNT',
        title: 'Account Verification Successful!',
        description:
          'Congratulations, your account has been successfully verified! Enjoy thrilling flights with us.',
        isRead: false,
        userId: 1,
      },
      {
        type: 'DISCOUNT',
        title: 'Special Promo for You!',
        description:
          'Get a 20% discount on your next ticket booking. Offer valid for a limited time.',
        isRead: false,
      },
      {
        type: 'EVENT',
        title: 'Flight Schedule Change Notification',
        description:
          'Please take note of the latest changes to your flight schedule. Check the details here.',
        isRead: false,
      },
      {
        type: 'PAYMENT',
        title: 'Payment Notification',
        description:
          'Your payment has been successfully processed. Thank you for booking tickets with us.',
        isRead: true,
        userId: 1,
      },
      {
        type: 'INFO',
        title: 'New Feature Released!',
        description:
          'Enjoy faster and easier flight search features. Try it now!',
        isRead: false,
      },
      {
        type: 'DISCOUNT',
        title: 'Flash Sale: Limited-Time Ticket Discounts!',
        description:
          'Book your favorite flights at discounted prices. Limited-time offer!',
        isRead: false,
      },
      {
        type: 'ACCOUNT',
        title: 'Password Change Successful',
        description:
          'You have successfully updated your ticket booking account password.',
        isRead: true,
        userId: 2,
      },
      {
        type: 'EVENT',
        title: 'Announcement: Flight Delay',
        description:
          'Your flight has been delayed. Check the latest updates in our app.',
        isRead: false,
      },
      {
        type: 'PAYMENT',
        title: 'Payment Notification',
        description:
          'Your payment has been successfully processed. Thank you for booking tickets with us.',
        isRead: true,
        userId: 2,
      },
    ],
  });

  // Seed Discount
  console.log('seeding discounts...');
  function generateRandomCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

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

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
