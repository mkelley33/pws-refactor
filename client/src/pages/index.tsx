import React from 'react';
import 'normalize.css';
import Layout from '@components/layout';
import profilePic from '../../images/profile-pic.jpg';

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
    <Layout style={{ border: '1px red solid' }}>
      <section>
        <h1>About me</h1>
        <p>
          <img
            src={profilePic as string}
            alt="Michaux Kelley Profile Pic"
            style={{ float: 'left', width: '150px', marginRight: '1rem', marginBottom: '1rem', clear: 'right' }}
          />
          Michaux Kelley&mdash;a software developer, music lover, player of instruments, modern dude,
          natural-born-world-shaker, aspiring lepidopterist, philatelist, punk, writer, poet, and JavaScript/TypeScript
          hacker.
        </p>
        <p>
          I&apos;ve been in software development for about {numYearsHacking} years now and have coded everything from
          full stack to more recently as a full-on front-end engineer.
        </p>
      </section>
    </Layout>
  );
};

export default IndexPage;
