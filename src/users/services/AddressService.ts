import {AddressRepository} from "@/users/repositories/AddressRepository";

import {AddressModel} from "@/users/types";

export async function addAddress(userId: string, data: AddressModel) {
  const totalAddr = await AddressRepository.count(userId)
  if (totalAddr >= 3) {
    throw new Error("maximum number of addresses has reached")
  }

  return await AddressRepository.create(userId, data);
}

export async function deleteAddress(userId: string, addressId: string) {
  const address = await AddressRepository.findOne(addressId)
  if (userId !== address?.userId) {
    throw new Error("user does not own this address");
  }

  return await AddressRepository.delete(addressId);
}

export async function editAddress(userId: string, addressId: string, data: AddressModel) {
  const address = await AddressRepository.findOne(addressId)
  if (userId !== address?.userId) {
    throw new Error("user does not own this address");
  }

  return await AddressRepository.update(addressId, data)
}

export async function getAddress(userId: string, addressId: string) {
  const address = await AddressRepository.findOne(addressId);
  if (userId !== address?.userId) {
    throw new Error("user does not own this address");
  }

  return address;
}

export async function getAddresses(userId: string) {
  return await AddressRepository.findAll(userId)
}