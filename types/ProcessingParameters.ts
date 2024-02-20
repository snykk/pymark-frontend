type SingleOrTupleValue = number | [number, number];

type ParameterValues = number[] | SingleOrTupleValue[] | { type: string; crop_box: [number, number, number, number] }[] | { label: string; values: number[] };

interface IProcessingParameters {
    [key: string]: {
        label: string;
        values: ParameterValues;
    }[];
}

export const ProcessingParameters: IProcessingParameters = {
    salt_and_pepper: [{ label: "probability", values: [0.001, 0.05, 0.1, 0.3, 0.5, 0.9] }],
    blur: [{ label: "sigma", values: [0.1, 0.5, 1, 2, [1, 1], [2, 1]] }],
    gaussian: [{ label: "standard_deviation", values: [0.1, 0.5, 2, 5, 10] }],
    median: [{ label: "kernel", values: [3, 5, 7, 9, 11] }],
    jpeg_compression: [{ label: "compression_quality", values: [10, 25, 40, 50, 75, 100] }],
    cropping: [
        {
            label: "Parameters",
            values: [
                { type: "inner", crop_box: [200, 200, 400, 400] },
                { type: "inner", crop_box: [200, 900, 900, 1000] },
                { type: "outer", crop_box: [0, 0, 800, 1000] },
                { type: "outer", crop_box: [0, 0, 1024, 900] },
            ],
        },
    ],
    sharpening: [
        { label: "sigma", values: [0.1, 0.5, 2, 10] },
        { label: "alpha", values: [0.1, 0.5, 1, 2] },
    ],
};
