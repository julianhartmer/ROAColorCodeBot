#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>

using namespace cv;
using namespace std;
#define DATA_DIR "data"
#define SKIN_PADDING 5
#define MERGED_MAX_COL_NUM 2

Vec3b bgr2hsv(Vec3b pixel)
{
	Mat bgr = Mat(1, 1, CV_8UC3, pixel);
	Mat hsv;
	cvtColor(bgr, hsv, COLOR_BGR2HSV);
	return hsv.at<Vec3b>(0, 0);
}
Vec3b hsv2bgr(Vec3b pixel)
{
	Mat hsv = Mat(1, 1, CV_8UC3, pixel);
	Mat rgb;
	cvtColor(hsv, rgb, COLOR_HSV2BGR);
	return rgb.at<Vec3b>(0, 0);
}

int char2hex(char c)
{
    if (c >= 'A' && c <= 'F')
    {
        return (c - 'A' + 10);   
    }
    else if (c >= 'a' && c <= 'f')
    {
        return (c - 'a' + 10); 
    }
    return (c - '0');
}

// code: Color Code input: Hex of rgb colors
// returns vector of Vec3b colors for opencv
vector<Vec3b> code2colors(const char *code)
{
    vector<Vec3b> colors;
    int i = 0;
    int color_num = 0;
    vector<int> tmp;
    while (code[i] != '\0' && code[i+1] != '\0')
    {
        if (code[i] == '-')
        {
            ++i;
            continue;
        }
        tmp.push_back(char2hex(code[i]) * 16 + char2hex(code[i+1]));
        if (tmp.size() == 3)
        {
            colors.push_back(Vec3b(tmp[2], tmp[1], tmp[0])); // remember: color code : rgb, here bgr
            tmp.clear();
        }
        i+=2;
    }
    return colors;
}

Mat set_alpha_from_mask(Mat fin, Mat alpha_mask)
{
    Mat newImage = Mat(fin.size(), CV_8UC4);
    vector<Mat> channels;
    split(fin, channels);

    bitwise_not(alpha_mask, alpha_mask);

    channels.push_back(alpha_mask);
    cv::merge(channels, newImage);
    return newImage;
}

Mat createPreview(const char*s, const char *code)
{
    vector<Vec3b> newColor = code2colors(code);
    Mat image = imread(string(DATA_DIR) + string("/") + s+string("/base.png"), IMREAD_COLOR); // Read the file
    int colors = newColor.size();
    Mat palettes[colors];
    Mat masks[colors];  // not used atm, may be used in the future for better results
    Mat alpha_mask = imread(string(DATA_DIR) + string("/") + s+string("/")+s+string("_mask.png"), IMREAD_GRAYSCALE);
    Mat fin = image.clone();

    for (int i = 0; i < colors; ++i)
    {
        palettes[i] = imread(string(DATA_DIR) + string("/") + s + string("/") + to_string(i) + string("palette.png"), IMREAD_COLOR);
    }

    for (int i = 0; i < colors; ++i)
    {
        Vec3b colorBase = palettes[i].at<Vec3b>(0,0);
        for (int j = 0; j < palettes[i].rows; ++j)
        {
            Vec3b colorBGR = palettes[i].at<Vec3b>(j,0);
            Vec3b hsv_diff = bgr2hsv(colorBase) - bgr2hsv(colorBGR);
            Vec3b finColor = hsv2bgr(bgr2hsv(newColor[i]) - hsv_diff);
            Mat mask;

            inRange(image, colorBGR, colorBGR, mask);

            fin.setTo(finColor, mask);
        }
    }
    return set_alpha_from_mask(fin, alpha_mask);
}

void createAndSavePreviews(const char *s, char **codes, int codeNum)
{
    Mat merged;
    string fileName;
    int i;
    Mat previews[codeNum];
    int imageRows = 0, imageCols = 0, mergedRows, mergedCols;
    int width, height;
    int col, row;
    for (i = 0; i < codeNum; i++)
    {
        previews[i] = createPreview(s, codes[i]);
        if (imageCols < MERGED_MAX_COL_NUM)
        {
            imageCols++;
        }
        if (i % (MERGED_MAX_COL_NUM) == 0)
        {
            imageRows++;
        }
        
    }
    width = previews[0].cols;
    height = previews[0].rows;
    cout << "i = "<< i << ", row = " << imageRows << ", col = " << imageCols <<"\n";
    cout << "width = "<< width << ", height = " << height << "\n";
    // merge previews
    mergedRows = height * (imageRows) + (imageRows) * SKIN_PADDING;
    mergedCols = width * (imageCols) + (imageRows) * SKIN_PADDING;
    merged = Mat(mergedRows, mergedCols, previews[0].type(), Scalar(0, 0, 0, 0));
    cout << "merged dimension: rows = " << merged.rows << ", cols = " << merged.cols << "\n";
    row = 0;
    col = 0;
    for (i = 0; i < codeNum; i++)
    {
        cout << "i = "<< i << ", row = " << row << ", col = " << col << "\n";
        previews[i].copyTo(merged(cv::Rect(col, row, width, height)));
        if (((i + 1) % MERGED_MAX_COL_NUM == 0) && i != 0)
        {
            row += height + SKIN_PADDING;
            col = 0;
        }
        else
        {
            col += width + SKIN_PADDING;
            /* code */
        }
        

    }

    fileName.append(string(DATA_DIR) + string("/") + string(s)+"/skins/");
    for (i = 0; i < codeNum; ++i)
    {
        fileName.append(string(codes[i]));
        if (i != codeNum - 1)
            fileName.append("+");
    }
    fileName.append(".png");
    cout << fileName << '\n';
    imwrite(fileName, merged);
}

int main( int argc, char** argv )
{
    if( argc < 3)
    {
        cout << "usage: character colorcode\n";
        exit(1);
    }
    else if (!strcmp(argv[1], "absa"))
    {
        createAndSavePreviews("absa", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "clairen"))
    {
        createAndSavePreviews("clairen", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "elliana"))
    {
        createAndSavePreviews("elliana", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "etalus"))
    {
        createAndSavePreviews("etalus", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "forsburn"))
    {
        createAndSavePreviews("forsburn", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "kragg"))
    {
        createAndSavePreviews("kragg", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "maypul"))
    {
        createAndSavePreviews("maypul", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "orcane"))
    {
        createAndSavePreviews("orcane", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "ori"))
    {
        createAndSavePreviews("ori", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "ranno"))
    {
        createAndSavePreviews("ranno", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "shovelknight"))
    {
        createAndSavePreviews("shovelknight", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "sylvanos"))
    {
        createAndSavePreviews("sylvanos", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "wrastor"))
    {
        createAndSavePreviews("wrastor", &argv[2], argc - 2);
    }
    else if (!strcmp(argv[1], "zetterburn"))
    {
        createAndSavePreviews("zetterburn", &argv[2], argc - 2);
    }
    else
    {
        return 1;
    }
    

    return 0;
}