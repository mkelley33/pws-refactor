import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/react';

const makeCssTheme = (jsTheme: object, namespace: string) =>
  Object.entries(jsTheme).reduce(
    (cssTheme, [key, value]) => ({
      ...cssTheme,
      [`--${namespace}-${key}`]: value,
    }),
    {}
  );

const defaultTheme = {
  name: 'default',
  darkGrey: 'rgba(40, 44, 52, 1)',
  semiDarkGrey: 'rgba(54, 60, 71, 1)',
  mediumGrey: 'rgba(64, 71, 85, 1)',
  mediumLightGrey: 'rgba(104, 107, 112, 1)',
  lightBlue: '#61dafb',
};

const appHeader = css`
  background: linear-gradient(
    360deg,
    var(--default-darkGrey) 0%,
    var(--default-semiDarkGrey) 66%,
    var(--default-mediumGrey) 100%
  );
  color: white;
  border-bottom: 7px solid var(--mediumGrey);
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const appHeaderPhoto = css`
  background: transparent url('../images/profile-pic.jpg') no-repeat;
  background-size: cover;
  width: 5rem;
  height: 5rem;
  border: 2px solid var(--default-lightBlue);
  border-radius: 50%;
  margin: 0 auto;
`;

const Layout = (props: any): JSX.Element => {
  const cssTheme = React.useMemo(
    () => makeCssTheme(defaultTheme, 'default'),
    [defaultTheme]
  );

  return (
    <>
      <header style={cssTheme} css={appHeader}>
        <div css={appHeaderPhoto}>@mkelley33</div>
        <nav>
          <ul>
            <li>
              <Link to='/'>About</Link>
            </li>
            <li>
              <Link to='/blog'>Blog</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
            <li>
              <Link to='/photos'>Photos</Link>
            </li>
          </ul>
          <ul>
            <li>
              {!props.authenticated && <Link to='/register'>Register</Link>}
            </li>
            <li>
              {props.authenticated ? (
                <Link to='/sign-out'>Sign Out</Link>
              ) : (
                <Link to='/sign-in'>Sign In</Link>
              )}
            </li>
            <li>{props.authenticated && <Link to='/profile'>Profile</Link>}</li>
          </ul>
        </nav>
      </header>
      <main style={cssTheme}>{props.children}</main>
    </>
  );
};

export default Layout;
