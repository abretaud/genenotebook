/* eslint-disable react/prop-types */
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { compose } from 'recompose';

import { attributeCollection } from '/imports/api/genes/attributeCollection.js';
import { genomeCollection } from '/imports/api/genomes/genomeCollection.js';
import { scanGeneAttributes } from '/imports/api/genes/scanGeneAttributes.js';

import { withEither, isLoading, Loading } from '/imports/ui/util/uiUtil.jsx';

import AttributeInfo from './AttributeInfo.jsx';

function attributeDataTracker() {
  const attributeSub = Meteor.subscribe('attributes');
  const attributes = attributeCollection.find({}).fetch();
  const genomeSub = Meteor.subscribe('genomes');
  const genomes = genomeCollection.find({}).fetch();
  const loading = !attributeSub.ready() || !genomeSub.ready();
  return {
    attributes,
    genomes,
    loading,
  };
}

const withConditionalRendering = compose(
  withTracker(attributeDataTracker),
  withEither(isLoading, Loading),
);

function AdminAttributes({ attributes, genomes }) {
  function scanAttributes(event) {
    event.preventDefault();
    genomes.forEach(({ _id: genomeId }) => {
      scanGeneAttributes.call({ genomeId });
    });
  }
  return (
    <div>
      <hr />
      <button
        type="button"
        className="btn btn-warning"
        onClick={scanAttributes}
      >
        <span className="icon-exclamation" aria-hidden="true" />
          Scan all genes for attributes
      </button>
      <hr />
      <table className="table table-hover table-sm">
        <thead>
          <tr>
            {[
              'Name',
              'Query',
              'Display default',
              'Search default',
              'Actions',
            ].map((label) => (
              <th key={label} scope="col">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark py-0 px-2"
                  disabled
                >
                  {label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <AttributeInfo key={attribute._id} {...attribute} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withConditionalRendering(AdminAttributes);
