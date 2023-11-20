import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import ErrorAction from 'src/store/actions/errorAction';
import {
  getAllTableGridCells,
  getAllTableRows,
} from 'src/__tests__/utils/tableHelpers';
import { renderWithProviders } from 'src/__tests__/utils/testRenderer';
import { TemplateMachinesList } from 'src/components/TemplateManagement/TemplateMachinesList';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');
jest.mock('src/store/actions/errorAction');
(ErrorAction as jest.Mock).mockReturnValue(true);

const templateList = defaultTestWorkspaceTemplateDto;

test('Template machines list should display appropriate details for template', async () => {
  const testTemplate = templateList[0];
  renderWithProviders(<TemplateMachinesList template={testTemplate} />);
  expect(screen.getByTestId('template-machines-list')).toBeInTheDocument();
  getAllTableRows(document.body);
  const [, ...bodyRows] = getAllTableRows(document.body);
  const [testVMWithDisks, testVMWithoutDisks] = testTemplate.VirtualMachines;
  const [
    computerNameCell1,
    nameCell1,
    memoryCell1,
    osDiskCell1,
    dataDiskCell1,
    maxDataDiskCell1,
  ] = getAllTableGridCells(bodyRows[0]);
  expect(computerNameCell1).toHaveTextContent(testVMWithDisks.ComputerName);
  expect(nameCell1).toHaveTextContent(testVMWithDisks.Name);
  expect(memoryCell1).toHaveTextContent('4 GB');
  expect(osDiskCell1).toHaveTextContent('128 GB');
  expect(dataDiskCell1).toHaveTextContent('3');
  expect(maxDataDiskCell1).toHaveTextContent('4 GB');
  const [
    computerNameCell2,
    nameCell2,
    memoryCell2,
    osDiskCell2,
    dataDiskCell2,
    maxDataDiskCell2,
  ] = getAllTableGridCells(bodyRows[1]);
  expect(computerNameCell2).toHaveTextContent(testVMWithoutDisks.ComputerName);
  expect(nameCell2).toHaveTextContent(testVMWithoutDisks.Name);
  expect(memoryCell2).toHaveTextContent('8 GB');
  expect(osDiskCell2).toHaveTextContent('256 GB');
  expect(dataDiskCell2).toHaveTextContent('0');
  expect(maxDataDiskCell2).toHaveTextContent('-');
});
