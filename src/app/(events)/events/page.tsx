import React from 'react';

import { getAllEvents } from '~/lib/supabase/events';
import { Header } from '~/components';
import EventList from './components/event-list';
import ComingSoonScreen from '~/screens/coming-soon';
import { FormsTable, columns } from './components';
import { getActiveForms } from '~/lib/supabase/forms';

const Events = async () => {
  const forms = await getActiveForms();
  const events = await getAllEvents();

  return (
    <div className='mx-auto w-full max-w-screen-2xl px-2 py-4 text-center'>
      <Header title='' description='' />
      {events.length > 0 ? (
        <EventList serverDetails={events} />
      ) : forms.length > 0 ? (
        <FormsTable data={forms} columns={columns} />
      ) : (
        <ComingSoonScreen />
      )}
    </div>
  );
};

export default Events;
