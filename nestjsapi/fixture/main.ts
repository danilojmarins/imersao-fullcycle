import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const dataSource = app.get<DataSource>(getDataSourceToken());
  await dataSource.synchronize(true);

  const productRepository = dataSource.getRepository('Product');
  await productRepository.insert([
    {
      id: '10c8c216-9244-466f-8472-a1229a12aaa4',
      name: 'Product 1',
      description: 'Description 1',
      image_url: 'http://localhost:9000/products/1.png',
      price: 100,
    },
    {
      id: '3e1f2885-ffc6-4178-90fd-ca0ee6ecd5c6',
      name: 'Product 2',
      description: 'Description 2',
      image_url: 'http://localhost:9000/products/2.png',
      price: 200,
    },
    {
      id: '414789db-2874-4f4c-b4a1-4951490fb480',
      name: 'Product 3',
      description: 'Description 3',
      image_url: 'http://localhost:9000/products/3.png',
      price: 300,
    },
    {
      id: 'f4079b13-7fac-4616-a36f-ded247187b52',
      name: 'Product 4',
      description: 'Description 4',
      image_url: 'http://localhost:9000/products/4.png',
      price: 400,
    },
    {
      id: '142a87ed-9e35-4e87-ab34-272b00bd045a',
      name: 'Product 5',
      description: 'Description 5',
      image_url: 'http://localhost:9000/products/5.png',
      price: 500,
    },
  ]);

  await app.close();
}

bootstrap();
