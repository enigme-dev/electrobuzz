# Electrobuzz ⚡

[![analyze](https://github.com/alkuinvito/electrobuzz/actions/workflows/analyze.yml/badge.svg)](https://github.com/alkuinvito/electrobuzz/actions/workflows/analyze.yml)
[![deploy](https://github.com/alkuinvito/electrobuzz/actions/workflows/deploy.yml/badge.svg)](https://github.com/alkuinvito/electrobuzz/actions/workflows/deploy.yml)

## 💬 Introduction
Electrobuzz merupakan aplikasi berbasis web yang bisa digunakan untuk menjual / membeli jasa servis elektronik. Aplikasi ini akan menyediakan beberapa servis elektronik seperti servis AC, servis gadget (telepon selular dan tablet), servis komputer, servis TV dan servis kulkas. Aplikasi ini bersifat individualisme, dimana orang yang menjual jasa tidak terikat dengan instansi tertentu dan memiliki sertifikasi dalam bidang servis yang diminati. Untuk menganalisa sertifikasi tersebut, pihak penjual jasa diwajibkan untuk mengunggah sertifikasi / portofolio servis jasa yang diminati yang selanjutnya akan di verifikasi oleh pihak “electrobuzz” supaya penjual dapat dipercaya dan kompeten dalam bidangnya.

## 🚀 Quickstart
1. Create .env file locally and fill in exactly like .env.example
2. Set up Postgres and insert Postgres credentials in .env then run:
   ```
   npx prisma db push
   ```
3. Set up S3-compatible Object Storage Server and create "assets" and "vault" buckets
4. Set up [Algolia](https://algolia.com/) index called "merchants"
5. Set up [Watzap.id](https://watzap.id/) service
6. Set up Google Maps Javascript API from [Google Cloud Console](https://console.cloud.google.com/)
7. Create asymmetric key pair (public & private key)
8. Fill in every credentials in .env
9. Install dependencies with:
```
npm install
```
1.  Run server locally with:
```
npm run dev
```