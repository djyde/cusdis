# Integrate Cusdis into Docusaurus

[Docusaurus](https://github.com/facebook/docusaurus) is a user-friendly, open-source static site generator developed by Meta. It harnesses the full potential of **React** and **MDX**, making it easy to start, customizable, and suitable for localization.

## Usage

This guide will walk you through the steps to add Cusdis comments to your Docusaurus website pages.

### Installing Dependencies

Before integrating Cusdis, ensure that you have installed the required dependencies. You will need `react-cusdis`, which is a **React wrapper for Cusdis**. Install it as a dependency in your Docusaurus project:

```bash
npm install react-cusdis
# or
yarn add react-cusdis

```

### Create a Cusdis Component

Next, create a new component for Cusdis in your Docusaurus project. You can name it `CusdisComments.js` and place it in the `src/components folder`. Here's an example of what the component might look like:

```js
import { ReactCusdis } from 'react-cusdis';

export default function CusdisComments(props) {
  const appId = process.env.CUSDIS_APP_ID;

  return (
    <div>
      <ReactCusdis
        id="cusdis-thread"
        attrs={{
          host: "https://cusdis.com",
          appId: appId,
          pageId: props.attrs.pageId,
          pageTitle: props.attrs.pageTitle,
          pageUrl: props.attrs.pageUrl,
          theme: "auto",
        }}
      />
    </div>
  );
}

```

### Import and add the Cusdis Component

Once you've created the `CusdisComments.js` component, import it into the documentation page where you want to add the Cusdis comment system. Import the component at the top of your page file, like this:

```js
import CusdisComments from '../src/components/CusdisComments';
```

In the same documentation page, add the following code where you want to display the comment system:

```js
<CusdisComments
  id="cusdis_thread"
  attrs={{
    pageId: frontMatter.id,
    pageTitle: frontMatter.title,
    pageUrl: frontMatter.__resourcePath,
  }}
/>
```

This code snippet will render the Cusdis comment system on your Docusaurus page.

### Set Up Environment Variables (optional)

To securely store your Cusdis App ID, follow these steps to set up environment variables in your Docusaurus project:

#### Step 1: Install the `@docusaurus/plugin-client-redirects` Package

Install the `@docusaurus/plugin-client-redirects` package using npm or yarn:

```bash
npm install @docusaurus/plugin-client-redirects
# or
yarn add @docusaurus/plugin-client-redirects
```

#### Step 2: Configure Environment Variables

In your `docusaurus.config.js` file, add the following configuration under the `plugins` section to enable environment variables:

```js
plugins: [
  [
    "docusaurus2-dotenv",
    {
      systemvars: true,
    },
  ],
],
```

#### Step 3: Create an .env File

Create a `.env` file in the root of your Docusaurus project and add your **Cusdis App ID** to it. For example:

```env
CUSDIS_APP_ID=your-app-id
```

#### Step 4: Access Environment Variables

You can now access your environment variable in the `CusdisComments` component as follows:

```js
import { ReactCusdis } from 'react-cusdis';

export default function CusdisComments(props) {
  const appId = process.env.CUSDIS_APP_ID;

  // ... rest of the component code
}

```