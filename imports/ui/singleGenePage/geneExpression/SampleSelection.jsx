/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { groupBy } from 'lodash';

import { ExperimentInfo } from '/imports/api/transcriptomes/transcriptome_collection.js';

import { Dropdown, DropdownMenu, DropdownButton } from '/imports/ui/util/Dropdown.jsx';

import './sampleSelection.scss';

function dataTracker({ gene, children }) {
  const { genomeId } = gene;
  const experimentSub = Meteor.subscribe('experimentInfo');
  const loading = !experimentSub.ready();
  const experiments = ExperimentInfo.find({ genomeId }).fetch();
  const replicaGroups = groupBy(experiments, 'replicaGroup');
  return {
    loading,
    experiments,
    children,
    replicaGroups,
  };
}

const customStyles = {
  control: provided => ({
    ...provided,
    minWidth: 200,
    margin: 4,
  }),
  menu: () => ({
    boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
  }),
};

function DropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <span className="icon-search" />
    </components.DropdownIndicator>
  );
}

function SampleSelection({
  gene, replicaGroups, loading, children,
}) {
  const options = Object.keys(replicaGroups).map(replicaGroup => ({
    value: replicaGroup,
    label: replicaGroup,
  }));
  const [selection, setSelection] = useState([]);
  const [initialized, setInitialization] = useState(false);
  if (!loading && !initialized) {
    setSelection(options.slice(0, 10));
    setInitialization(true);
  }

  function renderChildren() {
    const _samples = selection.map(({ value }) => replicaGroups[value]);
    const samples = [].concat(..._samples);

    return React.Children.map(children, child => React.cloneElement(child, {
      samples,
      gene,
      loading,
    }));
  }

  return (
    <div>
      <div className="d-flex sample-select">
        <Dropdown>
          <DropdownButton className="btn btn-sm btn-outline-dark dropdown-toggle px-2 py-0 border">
            Select samples&nbsp;
            <span className="badge badge-dark">
              {loading ? '...' : `${selection.length} / ${options.length}`}
            </span>
          </DropdownButton>
          <DropdownMenu className="dropdown-menu-right pt-0">
            <div
              className="btn-group btn-group-sm mx-1 my-1 d-flex justify-content-end"
              role="group"
            >
              <button
                className="btn btn-sm btn-outline-dark px-2 py-0 border"
                type="button"
                onClick={() => {
                  setSelection(options);
                }}
              >
                Select all
              </button>
              <button
                className="btn btn-sm btn-outline-dark px-2 py-0 border"
                type="button"
                onClick={() => {
                  setSelection([]);
                }}
              >
                Unselect all
              </button>
            </div>
            <Select
              autoFocus
              backSpaceRemovesValue={false}
              closeMenuOnSelect={false}
              components={{ DropdownIndicator, IndicatorSeparator: null }}
              controlShouldRenderValue={false}
              hideSelectedOptions={false}
              isClearable={false}
              isMulti
              menuIsOpen
              onChange={(newSelection) => { setSelection(newSelection); }}
              options={options}
              placeholder="Search..."
              styles={customStyles}
              tabSelectsValue={false}
              value={selection}
              noOptionsMessage={() => 'No expression data'}
            />
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>{renderChildren()}</div>
    </div>
  );
}

export default withTracker(dataTracker)(SampleSelection);
