import { getUserBookings } from "../BookingService";
import { getMerchant } from "../../../merchants/services/MerchantService";
import { getAddress } from "../../../users/services/AddressService";
import { uploadImg } from "../../../core/lib/image";
import { BookingRepository } from "../../repositories/BookingRepository";

jest.mock("../../../merchants/services/MerchantService");
jest.mock("../../../users/services/AddressService");
jest.mock("../BookingService");
jest.mock("../../repositories/BookingRepository");
jest.mock("../../../core/lib/image");

describe("BookingService", () => {
  let mBookingRepository;
  let BookingService;

  beforeEach(() => {
    mBookingRepository = jest.mocked(BookingRepository);
    BookingService = jest.requireActual("../BookingService");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("addBooking", () => {
    it("should create a booking", async () => {
      const userId = "clxm0e467000008mjd15m32hu";
      const merchantId = "clxm4hbaa000008l6b1v99mmp";
      const addressId = "clxm4hged000108l6fven16th";
      const input = {
        bookingPhotoUrl: "https://assets.electrobuzz.id/example.png",
        bookingComplain: "booking complain",
        bookingSchedule: "2024-05-29T00:00:00.000Z",
        addressId,
      };
      const merchant = {
        merchantId,
        merchantAvailable: true,
        merchantVerified: true,
      };
      const address = {
        addressId,
        addressDetail: "address detail",
        addressZipCode: "address zip code",
        addressCity: "address city",
        addressProvince: "address province",
      };
      const pendingBooking = 1;
      const data = {
        ...input,
        userId,
        merchantId,
        bookingSchedule: input.bookingSchedule,
        bookingStatus: "pending",
        bookingPhotoUrl: input.bookingPhotoUrl,
        addressDetail: address.addressDetail,
        addressZipCode: address.addressZipCode,
        addressCity: address.addressCity,
        addressProvince: address.addressProvince,
      };

      getMerchant.mockResolvedValue(merchant);
      getAddress.mockResolvedValue(address);
      getUserBookings.mockResolvedValue([undefined, 1]);
      uploadImg.mockResolvedValue("https://assets.electrobuzz.id/example.png");
      mBookingRepository.create.mockResolvedValue(data);

      await BookingService.addBooking(userId, merchantId, input);
      expect(getMerchant).toHaveBeenCalledTimes(1);
      expect(mBookingRepository.create).toHaveBeenCalledWith(data);
    });
  });
});
