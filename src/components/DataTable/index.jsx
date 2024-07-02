import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({rows, columns, onSelected}) {
  return (
    <div style={{ height: "100%", width: '100%' }}>
      <DataGrid
      select
        rows={rows}
        onRowSelectionModelChange={(ids) => onSelected(ids)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}