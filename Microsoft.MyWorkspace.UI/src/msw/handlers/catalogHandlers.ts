import { rest } from 'msw';
import { VirtualMachineCustomDto } from 'src/types/Catalog/VirtualMachineCustomDto.types';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';

export const fetchCatalogTemplatesSuccessHandler = (
  templateList: WorkspaceTemplateDto[]
) =>
  rest.get(
    `${process.env.REACT_APP_API_URL}/catalog/templates/v2`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(templateList));
    }
  );

export const fetchCatalogTemplatesErrorHandler = () =>
  rest.get(
    `${process.env.REACT_APP_API_URL}/catalog/templates/v2`,
    (req, res, ctx) => {
      return res(ctx.status(500), ctx.text('Error fetching templates.'));
    }
  );

export const fetchCatalogMachinesSuccessHandler = (
  customMachineList: VirtualMachineCustomDto[]
) =>
  rest.get(
    `${process.env.REACT_APP_API_URL}/catalog/machines`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(customMachineList));
    }
  );

export const fetchCatalogMachinesErrorHandler = () =>
  rest.get(
    `${process.env.REACT_APP_API_URL}/catalog/machines`,
    (req, res, ctx) => {
      return res(ctx.status(500), ctx.text('Error fetching machines.'));
    }
  );
