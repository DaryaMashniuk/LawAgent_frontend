// utils/documentFilters.ts
import { DOCUMENT_CATEGORIES } from "../utils/Constants";

export const documentFiltersConfig = [
    {
      key: "query",
      initialValue: "",
      label: "Поиск",
      type: "text",
      placeholder: "Введите название документа",
      component: "input",
      filterKey: "query",
    },
    {
      key: "categories",
      initialValue: [],
      label: "Категории",
      options: Object.entries(DOCUMENT_CATEGORIES).map(([value, label]) => ({value, label})),
      component: "checkbox",
      filterKey: "categories",
    },
  ];
  
  export const documentSortsConfig = [
    {
      key: "sortByTitle",
      initialValue: true,
      label: "По названию",
      component: "sort",
      sortKey: "title",
    },
    {
      key: "sortByDate",
      initialValue: false,
      label: "По дате",
      component: "sort",
      sortKey: "createdAt",
    },
    {
      key: "sortByNumberDesc",
      initialValue: false,
      label: "По номеру (новые первые)",
      component: "sort",
      sortKey: "number,desc", 
    },
  ];
  
  export const buildDocumentFiltersState = () => ({
    ...documentFiltersConfig.reduce((acc, { key, initialValue }) => ({ 
      ...acc, 
      [key]: initialValue 
    }), {}),
    ...documentSortsConfig.reduce((acc, { key, initialValue }) => ({ 
      ...acc, 
      [key]: initialValue 
    }), {}),
    page: 1,
    size: 10,
  });