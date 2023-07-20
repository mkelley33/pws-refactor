import path from 'path';
import { CreateFilePathArgs, createFilePath } from 'gatsby-source-filesystem';

const PostTemplate = path.resolve('./src/templates/post-template.tsx');
const BlogTemplate = path.resolve('./src/templates/blog-template.tsx');

interface IOnCreateNode {
  node: { internal: { type: string }; id: string };
  getNode: object;
  actions: {
    createNodeField: (nodeField: INodeField) => void;
  };
}

interface INodeField {
  node: object;
  name: string;
  value: string;
}

export const onCreateNode = ({ node, getNode, actions }: IOnCreateNode) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'posts' } as CreateFilePathArgs);
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
    createNodeField({
      node,
      name: 'id',
      value: node.id,
    });
  }
};

interface IActions {
  createPage: (page: object) => void;
}

interface IOnCreatePage {
  page: {
    path: string;
    matchPath: string;
  };
  actions: IActions;
}

// gatsby-node.ts
// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
export const onCreatePage = ({ page, actions }: IOnCreatePage) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/email-verification/)) {
    page.matchPath = `/email-verification/*`;
    // Update the page.
    createPage(page);
  }

  if (page.path.match(/^\/reset-password/)) {
    page.matchPath = `/reset-password/:token`;
    // Update the page.
    createPage(page);
  }
};

interface ICreatePages {
  graphql: (query: string) => Promise<{ data: { allMarkdownRemark: { edges: [] } } }>;
  actions: IActions;
}

interface INode {
  node: {
    fields: {
      slug: string;
      id: string;
    };
  };
}

export const createPages = async ({ graphql, actions }: ICreatePages) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              id
              slug
            }
          }
        }
      }
    }
  `);

  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach(({ node: post }: INode) => {
    createPage({
      path: `posts${post.fields.slug}`,
      component: PostTemplate,
      context: {
        slug: post.fields.slug,
        id: post.fields.id,
      },
    });
  });

  const postsPerPage = 5;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  interface IPage {
    path: string;
    component: typeof BlogTemplate | typeof PostTemplate;
    context: {
      slug?: string;
      limit: number;
      skip: number;
      isFirstPage: boolean;
      isLastPage: boolean;
      currentPage: number;
      totalPages: number;
    };
  }

  Array.from({ length: totalPages }).forEach((_, index) => {
    const currentPage = index + 1;
    const isFirstPage = index === 0;
    const isLastPage = currentPage === totalPages;

    createPage({
      path: isFirstPage ? '/blog' : `/blog/${currentPage}`,
      component: BlogTemplate,
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        isFirstPage,
        isLastPage,
        currentPage,
        totalPages,
      },
    } as IPage);
  });
};
