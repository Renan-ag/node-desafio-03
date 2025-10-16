import { OrganizationsRepository } from '@/repositories/organization-repository';
import { hash } from 'bcryptjs';
import { Organization } from 'generated/prisma';
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists';

interface RegisterOrganizationUseCaseRequest {
  responsibleName: string
  email: string
  zipCode: string
  address: string
  city: string
  latitude: number
  longitude: number
  whatsapp: string
  password: string
}

interface RegisterOrganizationUseCaseResponse {
  organization: Organization
}

export class RegisterOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) { }

  async execute({
    address,
    city,
    email,
    latitude,
    longitude,
    password,
    responsibleName,
    whatsapp,
    zipCode,
  }: RegisterOrganizationUseCaseRequest): Promise<RegisterOrganizationUseCaseResponse> {
    const passwordHashed = await hash(password, 6);
    const organizationWithSameEmail = await this.organizationsRepository.findByEmail(email);

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError();
    }

    const organization = await this.organizationsRepository.create({
      responsible_name: responsibleName,
      email,
      password: passwordHashed,
      zip_code: zipCode,
      address,
      city,
      latitude,
      longitude,
      whatsapp,
    });

    return { organization };
  }
}