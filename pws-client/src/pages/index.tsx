import * as React from 'react';
import Layout from '@components/layout';

const getDateDiffInYears = (secondDate: Date, firstDate: Date) => {
  let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

const IndexPage = (): JSX.Element => {
  const [numYearsHacking, setNumYearsHacking] = React.useState(0);

  React.useEffect(() => {
    setNumYearsHacking(getDateDiffInYears(new Date(2005, 8, 1), new Date()));
    console.log('render');
  }, [numYearsHacking]);

  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <p>
          My name's Michaux Kelley. I’m a software developer, modern dude,
          natural-born-world-shaker, aspiring lepidopterist, philatelist, punk,
          writer, poet, and JavaScript hacker.
        </p>
        <p>
          I've been in software development for about {numYearsHacking} years
          now and have coded everything from full stack to more recently as a
          full-on front-end engineer. What can I say? I love to code!
        </p>
      </section>
    </Layout>
  );
};

export default IndexPage;
