import React from 'react';

import { Header } from '~/components';
import { FormsTable, columns } from './components';
import { getActiveForms } from '~/lib/supabase/forms';
import ComingSoonScreen from '~/screens/coming-soon';

const Events = async () => {
  const forms = await getActiveForms();

  return (
    <div className='mx-auto w-full max-w-screen-2xl px-2 py-4 text-center'>
      <Header title='' description='' />
      {forms.length > 0 ? (
        <FormsTable data={forms} columns={columns} />
      ) : (
        <ComingSoonScreen />
      )}
    </div>
  );
};

export default Events;