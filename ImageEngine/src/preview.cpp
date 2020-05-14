#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
using namespace cv;
using namespace std;
#define DATA_DIR "data"

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
            colors.push_back(Vec3b(tmp[2], tmp[1], tmp[0])); // remeber: color code : rgb, here bgr
            tmp.clear();
            cout << colors[colors.size()-1] << "\n";
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

void createPreview(const char*s, const char *code)
{
    vector<Vec3b> newColor = code2colors(code);
    Mat image = imread(string(DATA_DIR) + string("/") + s+string("/base.png"), IMREAD_COLOR); // Read the file
    int colors = newColor.size();
    Mat palettes[colors];
    Mat masks[colors];  // not used atm, may be used in the future for better results
    Mat alpha_mask = imread(string(DATA_DIR) + string("/") + s+string("/")+s+string("_mask.png"), IMREAD_GRAYSCALE);
    //cout << "loading file " << string(DATA_DIR) + string("/") + s +string("/")+s+string("_mask.png\n");
    Mat fin = image.clone();

    for (int i = 0; i < colors; ++i)
    {
        //cout << (s + string("/") + to_string(i) + string("palette.png")) << "\n";
        palettes[i] = imread(string(DATA_DIR) + string("/") + s + string("/") + to_string(i) + string("palette.png"), IMREAD_COLOR);
        // masks[i] = imread(s + string("/") + to_string(i) + string("mask.png"), IMREAD_COLOR);
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
    cout << "creating skin "+string(DATA_DIR) + string("/") + string(s)+"/skins/" + string(code) + ".png\n";
    imwrite(string(DATA_DIR) + string("/") + string(s)+"/skins/" + string(code) + ".png", set_alpha_from_mask(fin, alpha_mask));
}

int main( int argc, char** argv )
{
    if( argc < 3)
    {
        cout << "usage: character colorcode\n";
        exit(1);
    }

    if (!strcmp(argv[1], "absa"))
    {
        createPreview("absa", argv[2]);
    }
    if (!strcmp(argv[1], "clairen"))
    {
        createPreview("clairen", argv[2]);
    }
    if (!strcmp(argv[1], "elliana"))
    {
        createPreview("elliana", argv[2]);
    }
    if (!strcmp(argv[1], "etalus"))
    {
        createPreview("etalus", argv[2]);
    }
    if (!strcmp(argv[1], "forsburn"))
    {
        createPreview("forsburn", argv[2]);
    }
    if (!strcmp(argv[1], "kragg"))
    {
        createPreview("kragg", argv[2]);
    }
    if (!strcmp(argv[1], "maypul"))
    {
        createPreview("maypul", argv[2]);
    }
    if (!strcmp(argv[1], "orcane"))
    {
        createPreview("orcane", argv[2]);
    }
    if (!strcmp(argv[1], "ori"))
    {
        createPreview("ori", argv[2]);
    }
    if (!strcmp(argv[1], "ranno"))
    {
        createPreview("ranno", argv[2]);
    }
    if (!strcmp(argv[1], "shovelknight"))
    {
        createPreview("shovelknight", argv[2]);
    }
    if (!strcmp(argv[1], "sylvanos"))
    {
        createPreview("sylvanos", argv[2]);
    }
    if (!strcmp(argv[1], "wrastor"))
    {
        createPreview("wrastor", argv[2]);
    }
    if (!strcmp(argv[1], "zetterburn"))
    {
        createPreview("zetterburn", argv[2]);
    }

    // srand(time(NULL));
    // Mat image;
    // Mat mask[7];
    // image = imread(argv[1], IMREAD_COLOR); // Read the file
    // Mat fin = image.clone();
    // int colors = stoi(argv[2]);
    // Mat palettes[colors];
    // Vec3b newColor[2] = {Vec3b(rand() % 255,rand() % 255,rand() % 255), Vec3b(rand() % 255,rand() % 255,rand() % 255)}; 
    // for (int i = 0; i < colors; ++i)
    // {
    //     palettes[i] = imread(to_string(i) + "palette.png", IMREAD_COLOR);
    // }

    // vector<Mat> channel(4);

    // split(image, channel);
    
    // vector<cv::Vec3b> subcolors[colors];
    // for (int i = 0; i < colors; ++i)
    // {
    //     Vec3b colorBase = palettes[i].at<Vec3b>(0,0);
    //     for (int j = 0; j < palettes[i].rows; ++j)
    //     {
    //         Vec3b colorBGR = palettes[i].at<Vec3b>(j,0);
    //         Vec3b hsv_diff = bgr2hsv(colorBase) - bgr2hsv(colorBGR);
    //         Vec3b finColor = hsv2bgr(bgr2hsv(newColor[i]) - hsv_diff);
    //         cout << finColor << "\n";
    //         cout << hsv_diff << "\n";
    //         cout << colorBGR << "\n";
    //         cout << colorBase << "\n";
    //         Mat mask;

    //         inRange(image, colorBGR, colorBGR, mask);

    //         fin.setTo(finColor, mask);
    //     }
    // }
    
    // imwrite("temp.png", fin);
    // imwrite("original.png", image);
    return 0;
}