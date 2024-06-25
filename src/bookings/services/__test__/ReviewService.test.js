import {
  createReview,
  getMerchantReviews,
  getMerchantReviewsDetail,
} from "../ReviewService";
import { addMerchantIndex } from "../../../merchants/services/MerchantService";
import { createNotification } from "../../../notifications/services/NotificationService";
import { ReviewRepository } from "../../repositories/ReviewRepository";
import { getUserBooking } from "../BookingService";
import { Cache } from "../../../core/lib/cache";
import { RedisClient } from "../../../core/adapters/redis";

jest.mock("../../repositories/ReviewRepository");
jest.mock("../../../core/lib/cache");
jest.mock("../BookingService");
jest.mock("../../../merchants/services/MerchantService");
jest.mock("../../../notifications/services/NotificationService");

describe("ReviewService", () => {
  let mReviewRepository;
  let mCache;

  beforeEach(() => {
    mReviewRepository = jest.mocked(ReviewRepository);
    mCache = jest.mocked(Cache);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await RedisClient.quit();
  });

  describe("createReview", () => {
    it("should create a review", async () => {
      const bookingId = "clxm0e467000008mjd15m32hu";
      const userId = "clxm0e467000008mjd15m32hu";
      const input = { reviewBody: "test review", reviewStars: 5 };
      const booking = {
        bookingId: "clxm0e467000008mjd15m32hu",
        bookingStatus: "done",
        bookingPhotoUrl: "https://assets.electrobuzz.id/example.png",
        bookingComplain: "booking complain",
        bookingSchedule: new Date(),
        merchant: {
          merchantId: "clxm0e467000008mjd15m32hu",
          merchantName: "merchant name",
          merchantPhotoUrl: "https://assets.electrobuzz.id/example.png",
          user: {
            phone: "08111222333",
          },
        },
      };
      const review = {
        ...input,
        reviewId: "clxm0e467000008mjd15m32hu",
        merchantId: "clxm0e467000008mjd15m32hu",
        bookingId: "clxm0e467000008mjd15m32hu",
        userId: "clxm0e467000008mjd15m32hu",
      };

      getUserBooking.mockResolvedValue(booking);

      mReviewRepository.create.mockResolvedValue(review);

      await createReview(bookingId, userId, input);

      expect(mReviewRepository.create).toHaveBeenCalledTimes(1);
      expect(addMerchantIndex).toHaveBeenCalledTimes(1);
      expect(createNotification).toHaveBeenCalledTimes(1);
      expect(mCache.deleteWithPrefix).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if booking is not done", async () => {
      const bookingId = "clxm0e467000008mjd15m32hu";
      const userId = "clxm0e467000008mjd15m32hu";
      const input = { reviewBody: "test review", reviewStars: 5 };
      const booking = {
        bookingId: "clxm0e467000008mjd15m32hu",
        bookingStatus: "pending",
        bookingPhotoUrl: "https://assets.electrobuzz.id/example.png",
        bookingComplain: "booking complain",
        bookingSchedule: new Date(),
        merchant: {
          merchantId: "clxm0e467000008mjd15m32hu",
          merchantName: "merchant name",
          merchantPhotoUrl: "https://assets.electrobuzz.id/example.png",
          user: {
            phone: "085734926345",
          },
        },
      };

      getUserBooking.mockResolvedValue(booking);

      expect(createReview(bookingId, userId, input)).rejects.toThrow(
        "booking is not done"
      );
    });

    it("should throw an error if review already exists", async () => {
      const bookingId = "clxm0e467000008mjd15m32hu";
      const userId = "clxm0e467000008mjd15m32hu";
      const input = { reviewBody: "test review", reviewStars: 5 };
      const review = {
        ...input,
        reviewId: "clxm0e467000008mjd15m32hu",
        merchantId: "clxm0e467000008mjd15m32hu",
        bookingId: "clxm0e467000008mjd15m32hu",
        userId: "clxm0e467000008mjd15m32hu",
      };
      const booking = {
        bookingId: "clxm0e467000008mjd15m32hu",
        bookingStatus: "done",
        bookingPhotoUrl: "https://assets.electrobuzz.id/example.png",
        bookingComplain: "booking complain",
        bookingSchedule: new Date(),
        merchant: {
          merchantId: "clxm0e467000008mjd15m32hu",
          merchantName: "merchant name",
          merchantPhotoUrl: "https://assets.electrobuzz.id/example.png",
          user: {
            phone: "085734926345",
          },
        },
        review,
      };

      getUserBooking.mockResolvedValue(booking);

      expect(createReview(bookingId, userId, input)).rejects.toThrow(
        "review has already exist"
      );
    });
  });

  describe("getMerchantReviews", () => {
    it("should return merchant reviews", async () => {
      const merchantId = "clxm0e467000008mjd15m32hu";
      const options = { page: 1 };
      const reviews = [
        {
          reviewId: "clxm0e467000008mjd15m32hu",
          reviewBody: "test review",
          reviewStars: 5,
          merchantId: "clxm0e467000008mjd15m32hu",
          bookingId: "clxm0e467000008mjd15m32hu",
          userId: "clxm0e467000008mjd15m32hu",
        },
      ];

      mReviewRepository.findMerchantReviews.mockResolvedValue(reviews);

      expect(getMerchantReviews(merchantId, options)).resolves.toEqual(reviews);
      expect(mReviewRepository.findMerchantReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe("getMerchantReviewsDetail", () => {
    it("should return merchant reviews detail", async () => {
      const merchantId = "clxm0e467000008mjd15m32hu";
      const options = { page: 1 };
      const review = {
        reviewId: "clxm0e467000008mjd15m32hu",
        reviewBody: "test review",
        reviewStars: 5,
        merchantId: "clxm0e467000008mjd15m32hu",
        bookingId: "clxm0e467000008mjd15m32hu",
        userId: "clxm0e467000008mjd15m32hu",
      };

      mReviewRepository.findMerchantReviewsDetail.mockResolvedValue(review);

      expect(getMerchantReviewsDetail(merchantId, options)).resolves.toEqual(
        review
      );
      expect(mReviewRepository.findMerchantReviewsDetail).toHaveBeenCalledTimes(
        1
      );
    });
  });
});
