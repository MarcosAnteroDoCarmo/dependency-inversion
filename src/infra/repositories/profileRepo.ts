import { Profile as PrismaProfile } from "@prisma/client";
import { IProfileRepository } from "../../domain/contracts/contractsProfileRepo";
import { Profile } from "../../domain/entities/profile";
import { prismaClient } from "../data/mysql/prismaClient";

export class ProfileRepo implements IProfileRepository {
  constructor() {}

  async createProfile(params: Profile) {
    const profile = await prismaClient.profile.create({
      data: {
        id: params.id,
        userName: params.userName,
        createdAt: params.createdAt,
        userId: params.userId,
      },
    });

    return this.prismaProfileToProfile(profile);
  }

  async findOneProfile(userName: string) {
    const profile = await prismaClient.profile.findUnique({
      where: { userName },
    });

    if (!profile) {
      console.log("Profile not found");

      return profile;
    }

    return this.prismaProfileToProfile(profile);
  }

  async findManyProfile(userName: string) {
    const profiles = await prismaClient.profile.findMany({
      where: { userName },
      select: {
        id: true,
        userName: true,
        createdAt: true,
        userId: true,
      },
    });

    if (!profiles) throw new Error("Profile not found");

    return profiles.map(this.prismaProfileToProfile);
  }

  async listProfile() {
    const profiles = await prismaClient.profile.findMany({
      where: {},
      select: {
        id: true,
        userName: true,
        createdAt: true,
        userId: true,
      },
    });

    if (!profiles) throw new Error("Profile not found");

    return profiles.map(this.prismaProfileToProfile);
  }

  async deleteProfile(userName: string) {
    const profile = await prismaClient.profile.delete({
      where: { userName },
    });

    if (!profile) throw new Error("Profile not found");

    return this.prismaProfileToProfile(profile);
  }

  async updateProfile(params: Profile) {
    const profile = await prismaClient.profile.update({
      where: { id: params.id },
      data: {
        id: params.id,
        userName: params.userName,
        createdAt: params.createdAt,
        userId: params.userId,
      },
    });

    if (!profile) throw new Error("Profile not found");

    return this.prismaProfileToProfile(profile);
  }

  prismaProfileToProfile(params: PrismaProfile): Profile {
    return new Profile({
      id: params.id,
      userName: params.userName,
      userId: params.userId,
    });
  }
}
