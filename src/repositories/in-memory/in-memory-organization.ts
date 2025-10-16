import { Prisma, Organization } from 'generated/prisma';
import { OrganizationsRepository } from '../organization-repository';
import { randomUUID } from 'crypto';

export class InMemoryOrganizationRepository implements OrganizationsRepository {
  public organizations: Organization[] = [];

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = {
      id: randomUUID(),
      responsible_name: data.responsible_name,
      email: data.email,
      zip_code: data.zip_code,
      address: data.address,
      city: data.city,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      whatsapp: data.whatsapp,
      password: data.password,
      created_at: new Date(),
      updated_at: null,
    };

    this.organizations.push(organization);

    return organization;
  }

  async findByEmail(email: string) {
    const organization = this.organizations.find((organization) => organization.email === email);

    return organization || null;
  }
}