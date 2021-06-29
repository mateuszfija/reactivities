import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import  NavBar  from '../layout/NavBar';
import  LoadingComponent  from '../layout/LoadingComponent';
import  ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import  agent  from '../../app/api/agent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  }, [])

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

    if(loading) return <LoadingComponent />

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
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

export default App;
