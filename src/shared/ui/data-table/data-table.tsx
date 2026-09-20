import {
  bodyClass,
  headCellClass,
  stateCellClass,
  stateStackClass,
  tableClass,
  wrapperClass,
} from "./data-table-variants";
import { type DataTableProps, type TableStateRowProps } from "./types";

export function DataTable({ columns, isFetching = false, children }: DataTableProps) {
  return (
    <div className={wrapperClass()}>
      <table aria-busy={isFetching || undefined} className={tableClass()}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={headCellClass({ align: column.align, width: column.width })}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClass({ fetching: isFetching })}>{children}</tbody>
      </table>
    </div>
  );
}

export function TableStateRow({ columnCount, children }: TableStateRowProps) {
  return (
    <tr>
      <td colSpan={columnCount} className={stateCellClass()}>
        <div className={stateStackClass()}>{children}</div>
      </td>
    </tr>
  );
}
