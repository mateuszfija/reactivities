import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import  NavBar  from '../layout/NavBar';
import  LoadingComponent  from '../layout/LoadingComponent';
import  ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import  agent  from '../../app/api/agent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
      activityStore.loadActivities();
  }, [activityStore])

  function handelSelectActivity(id: string)
  {
    setSelectedActivity(activities.find(x=>x.id === id));
  }

  function handelCancelActivity()
  {
    setSelectedActivity(undefined); 
  }

  function handleFormOpen(id?: string)
  {
    id ? handelSelectActivity(id) : handelCancelActivity();
    setEditMode(true);
  }

  function handleFormClose()
  {
    setEditMode(false);
  }

  function handleCreateorEditActivity(activity: Activity)
  {
    setSubmitting(true);
    if(activity.id)
    {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      })
    }
    else
    {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    });
    
  }

    if(activityStore.loadingInitial) return <LoadingComponent />

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activityStore.activities}
          selectedActivity={selectedActivity}
          selectActivity={handelSelectActivity}
          cancelSelectActivity={handelCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateorEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
}

export default observer(App);
