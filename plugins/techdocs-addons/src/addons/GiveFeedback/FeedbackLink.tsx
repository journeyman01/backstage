/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import { makeStyles } from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';

import { Link, GitHubIcon } from '@backstage/core-components';

import { Template, Repository } from './types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.common.black,
    fontSize: theme.typography.button.fontSize,
  },
}));

type FeedbackLinkProps = {
  template: Template;
  repository: Repository;
};

const getIcon = ({ type }: Repository) => {
  if (type === 'github') {
    return GitHubIcon;
  }
  return BugReportIcon;
};

const getName = ({ type }: Repository) => {
  if (type === 'github') {
    return 'Github';
  }
  return 'Gitlab';
};

const getUrl = (repository: Repository, template: Template) => {
  const { title, body } = template;
  const { protocol, resource, owner, name, type } = repository;
  const url = `${protocol}://${resource}/${owner}/${name}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(body);

  if (type === 'github') {
    return `${url}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
  }
  return `${url}/issues/new?[title]=${encodedTitle}&[body]=${encodedBody}`;
};

export const FeedbackLink = ({ template, repository }: FeedbackLinkProps) => {
  const classes = useStyles();

  const Icon = getIcon(repository);
  const url = getUrl(repository, template);

  return (
    <Link className={classes.root} to={url} target="_blank">
      <Icon /> Open new {getName(repository)} issue
    </Link>
  );
};
