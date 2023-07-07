import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/react';
import profilePic from '../../images/profile-pic.jpg';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

deckDeckGoHighlightElement();

const makeCssTheme = (jsTheme: object, namespace: string) =>
  Object.entries(jsTheme).reduce(
    (cssTheme, [key, value]) => ({
      ...cssTheme,
      [`--${namespace}-${key}`]: value,
    }),
    {}
  );

const defaultTheme = {
  cobalt2blue: '#00389c',
  black: '#222222',
  red: '#ff2600',
  blue: '#1478DB',
  white: '#f5f5f5',
  lightBlack: '#808080',
  lightBlue: '#0047ab',
  variableBlue: '#0d3a58',
  dustyBlue: '#34424C',
  highlightBlue: '#1F4662',
  selectionBlue: '#0050a4',
};

const main = css`
  padding: 1rem 4rem;
`;

const appHeader = css`
  background: linear-gradient(
    to bottom,
    var(--default-lightBlue) 0%,
    var(--default-cobalt2blue) 100%
  );
  border: 1px solid #00298d;
  border-bottom: 1px solid #ccc;
  box-shadow: inset 0 1px 0 #0f56ba;
  color: white;
  border-bottom: 7px solid var(--default-variableBlue);
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const appHeaderPhoto = css`
  background: transparent url(${profilePic}) no-repeat;
  background-size: cover;
  width: 5rem;
  height: 5rem;
  border: 2px solid var(--default-white);
  border-radius: 50%;
  margin: 0 auto;
`;

const appHeaderHandle = css`
  margin-top: 0.25rem;
  text-align: center;
`;

const appHeaderNav = css`
  width: 100%;
  li {
    display: inline-block;
  }

  a {
    color: var(--default-white);
    &:hover {
      color: #fff;
    }
  }
`;

const appHeaderMenuNav = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;

const appHeaderLoginNav = css`
  width: 200px;
  display: flex;
  float: right;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;

const appHeaderNavReorder = css`
  order: -1;
`;

const Layout = (props: any): JSX.Element => {
  const cssTheme = React.useMemo(
    () => makeCssTheme(defaultTheme, 'default'),
    [defaultTheme]
  );

  return (
    <>
      <header style={cssTheme} css={appHeader}>
        <div css={appHeaderPhoto}></div>
        <div css={appHeaderHandle}>@mkelley33</div>
        <nav css={appHeaderNav}>
          <ul css={appHeaderMenuNav}>
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
        </nav>
        <nav css={[appHeaderNav, appHeaderNavReorder]}>
          <ul css={appHeaderLoginNav}>
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
            {props.authenticated && (
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main style={cssTheme} css={main}>
        {props.children}
      </main>
    </>
  );
};

export default Layout;
