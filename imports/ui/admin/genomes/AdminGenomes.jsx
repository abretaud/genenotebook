import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { compose } from 'recompose';

import { ReferenceInfo } from '/imports/api/genomes/reference_collection.js';

import { withEither, isLoading, Loading } from '/imports/ui/util/uiUtil.jsx';

import AdminGenomeInfo from './AdminGenomeInfo.jsx';

const adminGenomesDataTracker = () => {
  const subscription = Meteor.subscribe('referenceInfo');
  const loading = !subscription.ready();
  const genomes = ReferenceInfo.find({}).fetch();
  return {
    genomes,
    loading
  }
}

const withConditionalRendering = compose(
  withTracker(adminGenomesDataTracker),
  withEither(isLoading, Loading)
)

const AdminGenomes = ({ genomes }) => {
  return (
    <div className="mt-2">
      <table className="table table-hover table-sm">
        <thead>
          <tr>
            {
              ['Reference name','Organism','Description','Permissions','Actions'].map(label => {
                return <th key={label} id={label}>{label}</th>
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            genomes.map(genome => {
              return <AdminGenomeInfo key={genome._id} genome={genome} />
            })
          }
        </tbody>
      </table>
    </div>
  )
}


export default withConditionalRendering(AdminGenomes)