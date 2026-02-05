type PrizeTableSlice = {
  slice_type: string;
  variation: string;
  primary: {
    items?: Array<{
      level: string;
      amount: string;
    }>;
    note?: string;
  };
};

export default function PrizeTable({ slice }: { slice: PrizeTableSlice }) {
  return (
    <table
      className="prizeTable"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <tbody>
        {slice.primary.items?.map((item, index) => (
          <tr key={index}>
            <th>{item.level}</th>
            <td>{item.amount}</td>
          </tr>
        ))}
        {slice.primary.note && (
          <tr className="prizeTable__note">
            <td colSpan={2}>{slice.primary.note}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
