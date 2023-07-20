import React from 'react';

interface IMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
}

const Meta = ({ title, description, canonicalUrl, robots = 'index, follow' }: IMeta) => (
  <>
    <title>{title}</title>
    <meta id="meta-description" name="description" content={description} />
    <meta id="meta-robots" name="robots" content={robots} />
    <link rel="canonical" href={`${canonicalUrl}`} />
  </>
);

export default Meta;
