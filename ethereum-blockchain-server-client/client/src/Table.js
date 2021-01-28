import { Box, Flex, Text } from "@chakra-ui/core";
import React from "react";
import { useTable } from "react-table";
import { colors as c } from "./colors";

function Table({ columns, data, getRowProps, currRow, rowHover }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <Box height="75vh" overflowY="scroll" width="100%" className="table">
      <Box as="table" width="100%" {...getTableProps()}>
        <Box as="thead">
          {headerGroups.map((headerGroup, idx) => (
            <Box
              as="tr"
              {...headerGroup.getHeaderGroupProps()}
              color={c.lightBlue}
            >
              {headerGroup.headers.map((column) => (
                <Box as="th" m={0} p="0.5rem" {...column.getHeaderProps()}>
                  <Flex direction="row" width="100%">
                    <Text textAlign="left">{`${column.render("Header")}`}</Text>
                  </Flex>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box as="tbody" {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Box
                as="tr"
                {...row.getRowProps(getRowProps(row))}
                _hover={rowHover}
              >
                {row.cells.map((cell) => {
                  return (
                    <Box as="td" m={0} p="0.5rem" {...cell.getCellProps()}>
                      <Text>{cell.render("Cell")}</Text>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
      {rows.length === 0 && (
        <Box align="center" justify="center" width="100%" mt="20%">
          <Text fontStyle="italic" color={c.white} textAlign="center">
            No data found
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default Table;
