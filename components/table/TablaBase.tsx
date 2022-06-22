import { ITableBaseProps } from "./ITableBase";

const TableBase = (props: ITableBaseProps) => {
  const styles = {
    table: `table-auto`
  };
  const { columns, data, key_column, caption, className, scrollableHeight } = props;

  if (data.length === 0) {
    return <>no data</>;
  }
  const tableheader = (
    <tr className="border-b">
      {columns.map((column) => (
        <th key={column.key} className={column.className}>
          {column.showname ? column.showname : column.name}
        </th>
      ))}
    </tr>
  );

  const rows = data.map((row_data) => {
    return (
      <tr key={row_data[key_column]} className="bg-white border-b">
        {props.columns.map((column) => (
          <td key={column.key} className={column.className}>
            {!column.component ? row_data[column.name] : column.component(row_data, column.name)}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <table className={styles.table}>
      {caption ? <caption>{caption}</caption> : null}
      <thead>{tableheader}</thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TableBase;
