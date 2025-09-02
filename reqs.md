- SERVER-1
    - creates a User baed on
        - fullName: string;
        - email: string;
        - message: string;
- SERVER-2
    - On successful User creation
        - send an email notification

These two servers communicate through RabbitMQ

- FRONTEND
    - form submission for the required data
    - POST Request hit to SERVER-1


Create frontend application with submit form 
fullName: string;
  email: string;
  message: string;
Create a microservice to save entity in Database, On successful save fire an email from email microservice.
For fronttend use next,js. For backend use Nest,js, Rabbitmq and Postgres.

Deadline 08:00 AM 3rd September 2025