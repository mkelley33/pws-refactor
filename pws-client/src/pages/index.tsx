import React from 'react';
import Layout from '@components/layout';
import 'normalize.css';

const getDateDiffInYears = (secondDate: Date, firstDate: Date) => {
  let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

const IndexPage = (): JSX.Element => {
  const [numYearsHacking, setNumYearsHacking] = React.useState(0);

  React.useEffect(() => {
    setNumYearsHacking(getDateDiffInYears(new Date(2005, 8, 1), new Date()));
  }, [numYearsHacking]);

  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <p>
          I&apos;m Michaux Kelley&mdash;a software developer, music lover, player of instruments, modern dude,
          natural-born-world-shaker, aspiring lepidopterist, philatelist, punk, writer, poet, and JavaScript/TypeScript
          hacker.
        </p>
        <p>
          I&apos;ve been in software development for about {numYearsHacking} years now and have coded everything from
          full stack to more recently as a full-on front-end engineer. What can I say? I love to code!
        </p>
      </section>
    </Layout>
  );
};

export default IndexPage;
