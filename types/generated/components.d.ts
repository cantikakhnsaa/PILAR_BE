import type { Schema, Struct } from '@strapi/strapi';

export interface CabangCabang extends Struct.ComponentSchema {
  collectionName: 'components_cabang_cabangs';
  info: {
    displayName: 'Cabang';
    icon: 'map-marker';
  };
  attributes: {
    alamat_lengkap: Schema.Attribute.Text;
    link_maps: Schema.Attribute.String;
    nama_cabang: Schema.Attribute.String;
    telepon: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'cabang.cabang': CabangCabang;
    }
  }
}
