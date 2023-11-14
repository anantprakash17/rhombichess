import React from 'react';

export default function PageNotFound({ title, message }) {
  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            {title}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            {message}
          </p>
          <a href="/" className="inline-flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}
