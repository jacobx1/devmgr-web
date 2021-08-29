import React, { useCallback, useEffect, useRef } from 'react';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { getSettings, setSettings } from '../data/settings';
import { useAppDispatch, useAppSelector } from '../reducers/root';
import { settingsReducerSlice } from '../reducers/settingsReducer';

export default function Settings() {
  const dispatch = useAppDispatch();

  const updateEngineers = (engineers: string[]) => {
    const settings = getSettings();
    settings.engineers = engineers;
    setSettings(settings);
    dispatch(settingsReducerSlice.actions.savedEngineers());
  };

  const localEngineers = useAppSelector(
    (state) => state.settings.pendingEngineers
  );
  const isDirty = useAppSelector((state) => state.settings.dirty);

  const githubUrlRef = useRef<HTMLInputElement>();
  const githubTokenRef = useRef<HTMLInputElement>();
  const engineerInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const settings = getSettings();
    githubUrlRef.current.value = settings.githubBaseUrl;
    githubTokenRef.current.value = settings.githubToken;
  }, []);

  const onAdd = useCallback((evt) => {
    evt.preventDefault();
    dispatch(
      settingsReducerSlice.actions.addEngineer(
        engineerInputRef.current.value.trim()
      )
    );
    engineerInputRef.current.value = '';
  }, []);
  const onSave = () => {
    updateEngineers(localEngineers);
    const settings = getSettings();
    settings.githubBaseUrl = githubUrlRef.current.value;
    settings.githubToken = githubTokenRef.current.value;
    setSettings(settings);
  };

  return (
    <div>
      <Form onSubmit={onAdd}>
        <FormGroup className="mb-3">
          <FormLabel>Github API base URL</FormLabel>
          <FormControl
            placeholder="https://git.company.com/api"
            ref={githubUrlRef}
          />
        </FormGroup>
        <Form.Group className="mb-3">
          <FormLabel>Github Token</FormLabel>
          <FormControl type="password" ref={githubTokenRef} />
        </Form.Group>
        <FormGroup>
          <FormLabel>Engineers</FormLabel>
          <InputGroup className="mb-3">
            <FormControl placeholder="Enter github id" ref={engineerInputRef} />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={onAdd}>
                Add
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <ListGroup>
            {localEngineers.map((engineer) => (
              <ListGroupItem
                key={engineer}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {engineer}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    dispatch(
                      settingsReducerSlice.actions.removeEngineer(engineer)
                    )
                  }
                >
                  Remove
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </FormGroup>
        <div className="mt-2">
          <Button onClick={onSave} className="mr-2">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
