import { Product, Shop } from "@prisma/client";

type Props = {
  userId: string;
  shops: Shop[];
  products: Product[];
};

const DashboardGlobal = ({ ...props }: Props) => {
  return (
    <>
      {/* TODO: Add a table with all products */}
      <div className="flex flex-col gap-3 align-middle">
        {props.products.map((product) => (
          <table key={product.id} className="table-auto">
            <thead className="text-left border-b border-gray-200 flex flex-row gap-3">
              <tr className="border-b border-gray-200 flex flex-row gap-3">
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="text-left">
              <tr className="border-b border-gray-200">
                {/* TODO: short name off product */}
                <td>{product.name.slice(0, 10)}</td>
                <td>{product.price}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {props.products.reduce(
                    (acc, product) => acc + product.price,
                    0
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        ))}
      </div>
    </>
  );
};

export default DashboardGlobal;
