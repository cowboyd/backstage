/*
 * Copyright 2021 Spotify AB
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

import { JsonValue } from '@backstage/config';

export type Status =
  | 'open'
  | 'processing'
  | 'failed'
  | 'cancelled'
  | 'completed';

export type CompletedTaskState = 'failed' | 'completed';

export type DbTaskRow = {
  taskId: string;
  spec: TaskSpec;
  status: Status;
  lastHeartbeat?: string;
  retryCount: number;
  createdAt: string;
  runId?: string;
};

export type TaskEventType = 'completion' | 'log';
export type DbTaskEventRow = {
  id: number;
  runId: string;
  taskId: string;
  body: string;
  type: TaskEventType;
  createdAt: string;
};

export type TaskSpec = {
  steps: Array<{
    id: string;
    name: string;
    action: string;
    parameters?: { [name: string]: JsonValue };
  }>;
};

export type DispatchResult = {
  taskId: string;
};

export interface Task {
  spec: TaskSpec;
  taskId: string;
  runId: string;
  emitLog(message: string): Promise<void>;
  complete(result: CompletedTaskState): Promise<void>;
}

export interface TaskBroker {
  claim(): Promise<Task>;
  dispatch(spec: TaskSpec): Promise<DispatchResult>;
}
