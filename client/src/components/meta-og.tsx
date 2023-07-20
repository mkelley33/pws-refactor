import React from 'react';

interface IMetaOgProps {
  type: string;
  title: string;
  description: string;
  imageSecureUrl: string;
  url: string;
  siteName: string;
  firstName?: string;
  lastName?: string;
}

const MetaOg = ({ type, title, description, imageSecureUrl, url, siteName, firstName, lastName }: IMetaOgProps) => (
  <>
    <meta property="og:type" content={type} />
    {firstName && <meta property="profile:first_name" content={firstName} />}
    {lastName && <meta property="profile:last_name" content={lastName} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image:secure_url" content={imageSecureUrl} />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={siteName} />
  </>
);

export default MetaOg;
