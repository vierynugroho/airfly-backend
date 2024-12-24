/*
  Warnings:

  - A unique constraint covering the columns `[flight_id,seat_number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "bookings_code_idx" ON "bookings"("code");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_flight_id_idx" ON "bookings"("flight_id");

-- CreateIndex
CREATE INDEX "bookings_return_flight_id_idx" ON "bookings"("return_flight_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_booking_date_idx" ON "bookings"("booking_date");

-- CreateIndex
CREATE INDEX "bookings_total_price_idx" ON "bookings"("total_price");

-- CreateIndex
CREATE INDEX "bookings_user_id_status_idx" ON "bookings"("user_id", "status");

-- CreateIndex
CREATE INDEX "bookings_user_id_booking_date_idx" ON "bookings"("user_id", "booking_date");

-- CreateIndex
CREATE INDEX "bookings_flight_id_status_idx" ON "bookings"("flight_id", "status");

-- CreateIndex
CREATE INDEX "bookings_booking_date_status_idx" ON "bookings"("booking_date", "status");

-- CreateIndex
CREATE INDEX "bookings_created_at_status_idx" ON "bookings"("created_at", "status");

-- CreateIndex
CREATE INDEX "bookings_total_price_status_idx" ON "bookings"("total_price", "status");

-- CreateIndex
CREATE INDEX "bookings_booking_date_total_price_idx" ON "bookings"("booking_date", "total_price");

-- CreateIndex
CREATE INDEX "flights_flight_number_idx" ON "flights"("flight_number");

-- CreateIndex
CREATE INDEX "flights_airline_id_idx" ON "flights"("airline_id");

-- CreateIndex
CREATE INDEX "flights_arrival_airport_idx" ON "flights"("arrival_airport");

-- CreateIndex
CREATE INDEX "flights_departure_airport_idx" ON "flights"("departure_airport");

-- CreateIndex
CREATE INDEX "flights_departure_time_idx" ON "flights"("departure_time");

-- CreateIndex
CREATE INDEX "flights_arrival_time_idx" ON "flights"("arrival_time");

-- CreateIndex
CREATE INDEX "flights_class_idx" ON "flights"("class");

-- CreateIndex
CREATE INDEX "flights_departure_time_class_idx" ON "flights"("departure_time", "class");

-- CreateIndex
CREATE INDEX "flights_id_departure_time_class_idx" ON "flights"("id", "departure_time", "class");

-- CreateIndex
CREATE INDEX "flights_departure_time_arrival_time_idx" ON "flights"("departure_time", "arrival_time");

-- CreateIndex
CREATE INDEX "flights_departure_time_arrival_time_class_idx" ON "flights"("departure_time", "arrival_time", "class");

-- CreateIndex
CREATE INDEX "flights_airline_id_class_idx" ON "flights"("airline_id", "class");

-- CreateIndex
CREATE INDEX "flights_price_idx" ON "flights"("price");

-- CreateIndex
CREATE INDEX "flights_id_idx" ON "flights"("id");

-- CreateIndex
CREATE INDEX "seats_flight_id_idx" ON "seats"("flight_id");

-- CreateIndex
CREATE INDEX "seats_status_idx" ON "seats"("status");

-- CreateIndex
CREATE INDEX "seats_seat_number_idx" ON "seats"("seat_number");

-- CreateIndex
CREATE INDEX "seats_departureTime_idx" ON "seats"("departureTime");

-- CreateIndex
CREATE INDEX "seats_arrivalTime_idx" ON "seats"("arrivalTime");

-- CreateIndex
CREATE INDEX "seats_flight_id_status_idx" ON "seats"("flight_id", "status");

-- CreateIndex
CREATE INDEX "seats_flight_id_seat_number_idx" ON "seats"("flight_id", "seat_number");

-- CreateIndex
CREATE INDEX "seats_departureTime_status_idx" ON "seats"("departureTime", "status");

-- CreateIndex
CREATE INDEX "seats_flight_id_departureTime_status_idx" ON "seats"("flight_id", "departureTime", "status");

-- CreateIndex
CREATE UNIQUE INDEX "seats_flight_id_seat_number_key" ON "seats"("flight_id", "seat_number");
